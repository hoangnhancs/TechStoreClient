import { Box, Button, TextField, Typography } from "@mui/material";
import comment_pet from "../assets/logo_pet.png";
import { useEffect, useRef, useState } from "react";
import React from "react";
import { User } from "../lib/types";
import LoginPromptDialog from "./LoginPromptDialog";

type Props = {
    onSendComment: (content: string, parentId?: string) => void;
    onDraftChange: (hasDraft: boolean) => void;
    currentUser: User | undefined;
}

const AddNewComment: React.FC<Props> = React.memo(({onSendComment, onDraftChange, currentUser}) => {
    const [commentContent, setCommentContent] = useState("");
    const [openLoginPrompt, setOpenLoginPrompt] = useState(false);
    const handleSendComment = () => {
        if (commentContent.trim().length > 0) {
            onSendComment(commentContent);
            setCommentContent("");
        }
    }
    const isDrafting = useRef(false);
    useEffect(() => {
        if (onDraftChange) {
            const isHasDraft = commentContent.trim().length > 0;
            if (isHasDraft != isDrafting.current) {
                isDrafting.current = isHasDraft;
                onDraftChange(isHasDraft);
            }
            //Mỗi lần commentContent thay đổi (gõ thêm 1 chữ, xoá 1 chữ) → useEffect chạy lại.
            //Dù trim().length > 0 vẫn là true, nó vẫn gọi lại onDraftChange(true), kể cả khi trạng thái không đổi.
            //Điều này khiến component cha (CommentList) bị gọi setDraftCount(...) dư thừa nhiều lần
        }
    }, [commentContent, onDraftChange]);
    return (
        <Box 
            sx={{
            border: "1px solid",
            borderColor: "divider",
            p: 2,
            borderRadius: "8px",
            mt: 2,
            }}
        >
            <Typography>
                Hỏi và đáp
            </Typography>
            <Box 
                display={"flex"}
                sx={{
                    height: "227px",
                    border: "1px solid",
                    borderColor: "divider",
                    p: 2,
                    borderRadius: "8px",
                }}
            >
                <Box
                    component="img"
                    src={comment_pet}
                    alt="User avatar"
                    sx={{
                    width: "160px",
                    height: "100%",
                    objectFit: "cover",
                    marginRight: "10px",
                    }}
                />
                <Box
                    height={"195px"}
                >
                    <Typography variant="h6">
                    Hãy đặt câu hỏi cho chúng tôi.
                    </Typography>
                    <Typography variant="body1">
                        TechStore sẽ phản hồi trong vòng 1 giờ. Nếu Quý khách gửi câu hỏi sau 22h, chúng tôi sẽ trả lời vào sáng hôm sau.
                        Thông tin có thể thay đổi theo thời gian, vui lòng đặt câu hỏi để nhận được cập nhật mới nhất!
                    </Typography>
                    <Box display={"flex"} height={'auto'}>
                    <TextField
                        fullWidth
                        multiline
                        placeholder="Nhập bình luận của bạn"
                        value={commentContent}
                        onChange={(e) => setCommentContent(e.target.value)}
                        onFocus={(e) => {
                            if (!currentUser && !openLoginPrompt) { 
                                setOpenLoginPrompt(true);
                                e.target.blur(); 
                            }
                        }}
                        sx={{
                            height: "100%",
                        }}
                    >  
                    </TextField>
                    <Button 
                        onClick={handleSendComment} 
                        variant="contained" 
                        color="primary" 
                        sx={{ height: '100%' }}
                    >
                        Gửi
                    </Button>
                    </Box>
                </Box>
            </Box>
            <LoginPromptDialog open={openLoginPrompt} onClose={() => setOpenLoginPrompt(false)} />
        </Box>
    )
})

export default AddNewComment;