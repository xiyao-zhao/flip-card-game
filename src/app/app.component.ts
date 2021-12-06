import { Component, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY } from '@angular/material/dialog';
import { CardData } from './card-data.interface';
import { RestartDialogComponent } from './restart-dialog/restart-dialog.component';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    title = 'card-game';
    cards: CardData[] = [];
    flippedCards: CardData[] = [];
    matchedCards: CardData[] = [];

    cardImageIds = [
        '2C.png',
        '4D.png',
        '5S.png',
        '6H.png',
        '7C.png',
        '8D.png',
        '9S.png',
        '10H.png',
        'QH.png'
    ]

    constructor(public dialog: MatDialog) {}

    ngOnInit(): void {
        this.createCards();
    }

    createCards() {
        this.cards = [];
        this.cardImageIds.map(id => {
            const cardData: CardData = {
                imageId: id,
                state: 'default'
            }
            this.cards.push({ ...cardData });
            this.cards.push({ ...cardData });
        })  

        this.cards = this.randomCards(this.cards);
    }

    randomCards(array: any[]): any[]{
        return array.map(arr => [Math.random(), arr])
            .sort((a, b) => a[0] - b[0])
            .map(i => i[1]);
    }

    clicked(i: number) {
        const cardInfo =  this.cards[i];

        if(cardInfo.state === 'default' && this.flippedCards.length < 2) {
            cardInfo.state = 'flipped';
            this.flippedCards.push(cardInfo);
            
            if(this.flippedCards.length > 1) {
                this.checkMatch();
            }
        } 
    }

    checkMatch() {
        setTimeout(() => {
            const cardOne = this.flippedCards[0];
            const cardTwo = this.flippedCards[1];

            if (cardOne.imageId === cardTwo.imageId) {
                cardOne.state = 'flipped';
                cardTwo.state = 'flipped';

                this.matchedCards.push(cardOne, cardTwo);
                if (this.matchedCards.length === this.cards.length) {
                    const dialogRef = this.dialog.open(RestartDialogComponent);

                    dialogRef.afterClosed().subscribe(() => this.reset());
                }

            } else {
                cardOne.state = 'default';
                cardTwo.state = 'default';
            }

                this.flippedCards = [];

            }, 1000)
    }

    reset() {
        this.flippedCards = [];
        this.matchedCards = []
        this.createCards();
    }
}
