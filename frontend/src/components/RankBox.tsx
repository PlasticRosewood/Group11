import { useState } from "react";
import './RankBox.css';

interface RankBoxProps {
    name: string;
    userRank: number;
    globalRank: number;
    coverArtSrc: string;
    id: string; // for html
}

function RankBox({ name, userRank, globalRank, coverArtSrc }: RankBoxProps) {

    return (
        <div className="rbWrapper">
            <h1 className="rankText">#{userRank}</h1>
            <div className="coverArtWrapper">
                <img className="coverArt" src={coverArtSrc} />
            </div>
            <h2 className="memberName">{name}</h2>
            <div></div> {/*used for padding in the grid*/}
            <div className="globalStats">
                <img src="https://seeklogo.com/images/G/globe-logo-42DE548AC7-seeklogo.com.png" />
                <h3>Global</h3>
                <h3>#{globalRank}</h3>
            </div>
        </div>
    );
}

export default RankBox;