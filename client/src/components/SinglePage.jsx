import dayjs from 'dayjs';

const SinglePage = (props) => {
    console.log(props.blocks)
    
    return(
        <>
        <h3>Page Title: {props.pageData.title} Author: {props.pageData.author}</h3>
        {
            props.blocks.map((block) =>
            <SingleBlock key={block.id} blockData={block}/>)
        }
        </>
    )
}



const SingleBlock = (props) => {
    return(
        props.blockData.type === "Header" ? (
            <h1>{props.blockData.content}</h1>
        ) : props.blockData.type === "Paragraph" ? (
            <p>{props.blockData.content}</p>
        ) : (
            <img src={`/images/${props.blockData.content}`}></img>
        )
    )
}

export default SinglePage;