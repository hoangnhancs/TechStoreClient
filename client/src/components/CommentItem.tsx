import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, TextField, Avatar, Stack } from "@mui/material";
import { Comment, User } from '../lib/types';
import LoginPromptDialog from './LoginPromptDialog';
import { NotificationSignalRService } from '../app/api/notificationSignalRService';
import { useLocation } from 'react-router';


type Props = {
  comment: Comment;
  depth: number;
  currentUser?: User;
  onSendReply: (content: string, parent?: string) => Promise<string>;
  onDraftChange: (hasDraft: boolean) => void;
  
}


const CommentItem: React.FC<Props> = React.memo(({
  comment,
  depth,
  currentUser,
  onSendReply,
  onDraftChange,
}) => {
  // console.log("current user img:", currentUser?.imageUrl, "comment user img:", comment.user?.imageUrl);
  const [replyContent, setReplyContent] = useState('');
  const [isOpenReply, setOpenReply] = useState<boolean>(false);
  const [openLoginPrompt, setOpenLoginPrompt] = useState(false);
  const location = useLocation();
  const dateFormatted = comment.createdAt instanceof Date 
    ? comment.createdAt.toLocaleString() 
    : new Date(comment.createdAt).toLocaleString();
  
  const isOwnComment = currentUser && currentUser.id === comment.user?.id;
  const handleSendReply = async () => {
    const commentId = await onSendReply(replyContent, comment.id);
    if (currentUser?.id.toString() !== comment.user.id.toString()) {
      if (comment.isAdminComment) {
        if (!currentUser?.isAdmin) {
          NotificationSignalRService
          .sendNotification("Bình luận mới", replyContent, location.pathname, undefined, 
            "e605dfb1-7540-4ae7-8cda-96f8dc1525a6", currentUser?.id || "", commentId, undefined);
        }
      }
      else {
        NotificationSignalRService
          .sendNotification("Bình luận mới", replyContent, location.pathname, comment.user.id, undefined, 
            currentUser?.id || "", commentId, undefined);
      }   
    }
    setReplyContent('');
    setOpenReply(false);
  }
  const isDrafting = useRef(false);
  useEffect(() => {
    if (onDraftChange) {
      const isHasDraft = replyContent.trim().length > 0;
      if (isHasDraft != isDrafting.current) {
        isDrafting.current = isHasDraft;
        onDraftChange(isHasDraft);
      }
      //Mỗi lần commentContent thay đổi (gõ thêm 1 chữ, xoá 1 chữ) → useEffect chạy lại.
      //Dù trim().length > 0 vẫn là true, nó vẫn gọi lại onDraftChange(true), kể cả khi trạng thái không đổi.
      //Điều này khiến component cha (CommentList) bị gọi setDraftCount(...) dư thừa nhiều lần
    }
  }, [replyContent, onDraftChange]);
  const handleCancelReply = () => {
    setReplyContent('');
    setOpenReply(false);
  }
  return (
    <Box 
      sx={{ 
        mb: 2, 
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider'
      }} >
      {/* Comment container với độ thụt lề theo cấp độ */}
      <Box 
        id={comment.id}
        sx={{
          ml: depth * 3, // Thụt lề dựa theo cấp độ
          p: 2,
          borderRadius: "inherit",
          position: 'relative',
          '&:hover': {
            borderColor: 'primary.light',
            boxShadow: 1
          },
          backgroundColor: isOwnComment ? 'rgba(66, 165, 245, 0.05)' : 'background.paper',
        }}
      >
        {/* Header: Avatar + User Info */}
        <Stack direction="row" spacing={1} alignItems="center" mb={1}>
          <Avatar 
            src={comment.user?.imageUrl} 
            alt={comment.user?.displayName || 'Unknown'}
            sx={{ width: 38, height: 38 }}
          >
            {comment.user?.displayName?.[0] || '?'}
          </Avatar>
          
          <Box>
            <Typography variant="subtitle2" fontWeight="bold">
              {comment.user?.displayName || 'Người dùng ẩn'}
            </Typography>
            
            <Typography variant="caption" color="text.secondary">
              {dateFormatted}
              {comment.isEdited && ' (đã chỉnh sửa)'}
            </Typography>
          </Box>
        </Stack>
        
        {/* Comment Content */}
        <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
          {comment.content}
        </Typography>
        
        {/* Action Buttons */}
        <Stack direction="row" spacing={1} mt={1}>
          {isOpenReply ? (
            <Button 
            onClick={handleCancelReply} 
            variant="text" 
            size="small"
            color="primary"
          >
            Hủy
          </Button>
          ) : (
            <Button 
            onClick={() => {
              if (!currentUser) {
                setOpenLoginPrompt(true);
                return;
              }
              setOpenReply(true);
            }} 
            variant="text" 
            size="small"
            color="primary"
          >
            Phản hồi
          </Button>
          )}
          
          {isOwnComment && (
            <Button variant="text" size="small" color="primary">
              Chỉnh sửa
            </Button>
          )}
        </Stack>
        
        {/* Reply Form */}
        {isOpenReply && (
          <Box mt={2} mb={1}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              maxRows={4}
              placeholder="Nhập phản hồi của bạn..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              size="small"
              sx={{ mb: 1 }}
            />
            
            <Button 
              variant="contained" 
              color="primary" 
              size="small"
              disabled={!replyContent.trim()}
              onClick={() => {
                handleSendReply();
              }}
            >
              Gửi phản hồi
            </Button>
          </Box>
        )}
        <LoginPromptDialog open={openLoginPrompt} onClose={() => setOpenLoginPrompt(false)} />
      </Box>
      
      {/* Replies - Recursive rendering */}
      {comment.replies && comment.replies.length > 0 && (
        <Box>
          {comment.replies.map(reply => (
            <CommentItem
              key={reply.id}
              comment={reply}
              depth={depth + 1}
              currentUser={currentUser}
              onSendReply={onSendReply}
              onDraftChange={onDraftChange}
            />
          ))}
        </Box>
      )}
    </Box>
  );
});

export default CommentItem;