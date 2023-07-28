import React, {useEffect, useState} from 'react';
import './App.css';
import {getGameRule, openBooster} from "./api";
import BoosterCard from "./component/BoosterCard.component";
import CardDetail from "./component/CardDetail.component";
import {download} from "./service";

const BoosterGamePlayer = (props) => {
    const {id} = props;

    const [step, setStep] = useState(0);
    const [gameRule, setGameRule] = useState();
    const [openModal, setOpenModal] = useState(false);
    const [detailCard, setDetailCard] = useState();
    const [boosterCards, setBoosterCards] = useState({});
    const [cards, setCards] = useState([]);

    useEffect(() => {
        getGameRule(id).then((result) => {
            setGameRule(result);
        })
    }, []);

    const handleOpenBooster = (id, index) => {
        if (boosterCards && !boosterCards[`${id}_${index}`]) {
            openBooster(id).then((result) => {
                const copy = {...boosterCards};
                copy[`${id}_${index}`] = result.cards[0].map((card) => ({
                    card,
                    show: false,
                }));
                setBoosterCards(copy);
            });
        }
    };

    const handleShowCard = (boosterCode, index) => {
        const copy = { ...boosterCards };
        copy[boosterCode][index].show = true;
        setBoosterCards(copy);
    }

    const handleOpenDetailModal = (card) => {
        setOpenModal(true);
        setDetailCard(card);
    }

    const handleCloseDetailModal = (card) => {
        setOpenModal(false);
        setDetailCard(null);
    }

    const handleNextStep = () => {
        setStep(1);
        const _cards = [];
        Object.keys(boosterCards).map((index) => boosterCards[index].map(c => _cards.push(c.card)));
        setCards(_cards);
    };

    const downloadDeck = (filename, deck) => {
        const ids = deck.map(({id}) => id);
        download(`${filename}.ydk`, ids.join('\n'));
    };

    return (
        <div className="App-header">
            {
                step === 0 && gameRule && gameRule.boosters_pack &&
                <React.Fragment>
                        <ul className="BoosterGame allBoosterCards">
                            { gameRule.boosters_pack.map((pack) => {
                                return Array(pack.quantity).fill().map((_, i) => (
                                    <li key={`${pack.booster_id}_${i}`} className="BoosterGame boosterCards">
                                        <div className="BoosterGame booster">
                                            <img src={pack.image_src} onClick={() => handleOpenBooster(pack.booster_id, i)} alt={pack.booster_id}/>
                                        </div>
                                        <div>
                                            {boosterCards && boosterCards[`${pack.booster_id}_${i}`] &&
                                            <ul className="BoosterGame cardsList">
                                                { boosterCards[`${pack.booster_id}_${i}`].map(({card, show}, j) => (
                                                    <li key={`${pack.booster_id}_${i}_${j}`} className="" onClick={() => {
                                                        if (show) handleOpenDetailModal(card)
                                                    }}>
                                                        <BoosterCard
                                                            card={card} show={show}
                                                            showCard={() => handleShowCard(`${pack.booster_id}_${i}`, j)}
                                                        />
                                                    </li>
                                                ))}
                                            </ul>
                                            }
                                        </div>
                                    </li>
                                ));
                            })}
                        </ul>
                        <button onClick={handleNextStep}>Next</button>
                    </React.Fragment>
            }
            {
                step === 1 &&
                <div>
                    <ul className="BoosterGame cards-grid">
                        {cards && cards.map((card, i) =>
                            (card && card.image_url &&
                                <li key={i} onClick={() => handleOpenDetailModal(card)}>
                                    <BoosterCard card={card} show={1}/>
                                </li>)
                            )}
                    </ul>
                    <button onClick={() => downloadDeck(`${boosterCards.name} - P2`, cards)}>Download Deck</button>
                </div>
            }
            <CardDetail open={openModal} card={detailCard} closeModal={handleCloseDetailModal}/>
        </div>
    );
}

export default BoosterGamePlayer;