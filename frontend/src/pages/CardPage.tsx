import CardUI from "../components/CardUI";
import LoggedInName from "../components/LoggedInName";
import PageTitle from "../components/PageTitle";

const CardPage = () => 
{
    return (
      <div>
        <PageTitle />
        <LoggedInName />
        <CardUI />
     </div>  
    );
}

export default CardPage;