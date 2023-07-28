import React, {useEffect} from 'react';

const BoosterCard = (props) => {
    const { card, show, showCard } = props;

    let _class = '';
    switch (card.rarity) {
        case 'Rare':
            _class = "rare";
            break;
        case 'Super Rare':
            _class = "rare super-rare";
            break;
        case 'Ultra Rare':
            _class = "rare ultra-rare";
            break;
        case 'Secret Rare':
            _class = "rare secret-rare";
            break;
        case 'Common':
            _class = "";
            break;
        default:
            console.log(`New rarity "${card.rarity}"`);
    }

    return (show ? <div className="shine">
            <img style={{width: 180}} src={(card?.image_url) ? card.image_url : ""} alt={card.name}/>
            <div className={_class}/>
        </div>
        : <img style={{width: 180}} src="https://ygoprodeck.com/pics/back_high.jpg" alt="back_high" onClick={showCard}/>)
}

export default BoosterCard;