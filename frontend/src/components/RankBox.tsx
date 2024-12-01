import { useState } from "react";
import './RankBox.css';

function RankBox(props : any) {

    //TODO: replace static example props w/ props passed by LeaderBoardPage.tsx

    return (
        <div className="rbWrapper">
            <h1 className="rankText">#{props.usrRank}</h1>
            <div className="coverArtWrapper">
                <img className="coverArt" src={props.coverArt}/>
            </div>
            <h2 className="memberName">{props.name}</h2>
            <div></div> {/*used for padding in the grid*/}
            <div className="globalStats">
                <img src="https://seeklogo.com/images/G/globe-logo-42DE548AC7-seeklogo.com.png" />
                <h3>Global</h3>
                <h3>#{props.globalRank}</h3>
            </div>
        </div>
    );
}

export default RankBox;