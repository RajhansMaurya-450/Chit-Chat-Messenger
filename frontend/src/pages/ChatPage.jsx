import { Box } from "@chakra-ui/react"
import { ChatState } from "../Context/ChatProvider"
import ChatBox  from "../components/miscellaneous/ChatBox"
import  MyChats  from "../components/miscellaneous/MyChats"
import SideDrawer from "../components/miscellaneous/SideDrawer"
const Chatpage = () => {
    const { user } = ChatState();

    return <div style={{ width: "100%" }}>
        {user && <SideDrawer/>} 
        <Box>
            {user && <MyChats />}
            {user && <ChatBox/>}
        </Box>
    
        
    </div>

}

export default Chatpage