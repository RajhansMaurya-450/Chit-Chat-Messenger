import { Box } from "@chakra-ui/react"
import { ChatState } from "../components/Context/ChatProvider"
const Chatpage = () => {
    const { user } = ChatState();

    return <div style={{ width: "100%" }}>
        {/*{user && <SideDrawer/>} */}
        <Box>
            {/*{user && <MyChats/>*/}
            {/*{user && <ChatBox/>}*/}
        </Box>
    
        
    </div>

}

export default Chatpage