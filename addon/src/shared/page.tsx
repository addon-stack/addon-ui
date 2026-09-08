import React from "react";
import {UIProvider, Button, Avatar, Odometer, Highlight, TextArea} from "addon-ui"

const Page = () => {
    return (
       <UIProvider>
           <Odometer value={1}/>
           <Highlight textToHighlight="Some" searchWords={['o']}>Some</Highlight>
           <Avatar fallback="TS"/>
           <Button>Test button</Button>
           <TextArea>Some test</TextArea>
       </UIProvider>
    );
}

export default Page;