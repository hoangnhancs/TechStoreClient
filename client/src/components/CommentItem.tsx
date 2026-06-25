import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Button, TextField, Avatar, Stack } from "@mui/material";
import { Comment, User } from '../lib/types';
import LoginPromptDialog from './LoginPromptDialog';
// import { useLocation } from 'react-router';
// import { toast } from 'react-toastify';
import { formatVNDate } from '../lib/util/util';


type Props = {
  comment: Comment;
  depth: number;
  currentUser?: User;
  onSendReply: (content: string, parent?: string) => Promise<string>;
  onDraftChange: (hasDraft: boolean) => void;
  isLastChild?: boolean; //kiem tra xem sau comment nay, con comment nao cung level khong
}


const CommentItem: React.FC<Props> = React.memo(({
  comment,
  depth,
  currentUser,
  onSendReply,
  onDraftChange,
  isLastChild = false,
}) => {
  // console.log("current user img:", currentUser?.imageUrl, "comment user img:", comment.user?.imageUrl);
  const [replyContent, setReplyContent] = useState('');
  const [isOpenReply, setOpenReply] = useState<boolean>(false);
  const [openLoginPrompt, setOpenLoginPrompt] = useState(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  // const location = useLocation();

  const isOwnComment = currentUser && currentUser.id === comment.userId;
  const handleSendReply = async () => {
    try {
      await onSendReply(replyContent, comment.id);
      setReplyContent('');
      setOpenReply(false);
      setIsExpanded(true); // Tự động mở rộng khi gửi phản hồi mới
    } catch (error) {
      console.error("Error sending reply: ", error);
    }
  }
  const isDrafting = useRef(false);
  useEffect(() => {
    if (onDraftChange) {
      const isHasDraft = replyContent.trim().length > 0;
      if (isHasDraft !== isDrafting.current) {
        isDrafting.current = isHasDraft;
        onDraftChange(isHasDraft);
      }
    }
  }, [replyContent, onDraftChange]);
  const handleCancelReply = () => {
    setReplyContent('');
    setOpenReply(false);
  }

  // Tính toán khoảng cách và các thông số hình học của đường nối dựa theo depth
  const isReply = depth > 0;
  const parentAvatarSize = depth <= 1 ? 38 : 32;
  const spacingPx = 12; // Sử dụng explicit gap 12px thay vì spacing={1.5} của Stack để tránh sai lệch do theme unit
  const lineOffset = -(parentAvatarSize / 2 + spacingPx);
  const curveWidth = Math.abs(lineOffset);
  const plValue = depth === 0 ? '50px' : '44px';

  // Tính toán đường nối cho phần replies con (parent của replies chính là comment hiện tại)
  const repliesParentAvatarSize = depth === 0 ? 38 : 32;
  const repliesLineOffset = -(repliesParentAvatarSize / 2 + spacingPx);
  const repliesCurveWidth = Math.abs(repliesLineOffset);

  return (
    <Box sx={{ position: 'relative', mt: isReply ? 1 : 2 }}>
      {/* Đường nối cho các phản hồi con */}
      {isReply && (
        <>
          {/* Đường dọc từ trên xuống (chỉ vẽ nếu KHÔNG PHẢI con cuối cùng) */}
          {!isLastChild && (
            <Box
              sx={{
                position: 'absolute',
                left: `${lineOffset}px`,
                top: 0,
                bottom: '-8px', // Bù vào phần margin-top (8px) của sibling tiếp theo để đảm bảo liên mạch
                borderLeft: '2px solid',
                borderColor: 'divider',
                zIndex: 1,
              }}
            />
          )}
          {/* Đường cong rẽ phải vào Avatar */}
          <Box
            sx={{
              position: 'absolute',
              left: `${lineOffset}px`,
              top: 0,
              width: `${curveWidth}px`,
              height: '16px', // Căn giữa theo chiều dọc của Avatar 32px
              borderLeft: '2px solid',
              borderBottom: '2px solid',
              borderColor: 'divider',
              borderBottomLeftRadius: '10px',
              zIndex: 1,
            }}
          />
        </>
      )}

      {/* Row chính chứa: Avatar (Trái) + Nội dung (Phải) */}
      <Box sx={{ position: 'relative' }}>
        <Box sx={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
          {/* Avatar */}
          <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              src={comment.userImageUrl || undefined}
              alt={comment.userDisplayName || 'Người dùng ẩn'}
              sx={{ width: isReply ? 32 : 38, height: isReply ? 32 : 38 }}
            >
              {comment.userDisplayName?.[0] || '?'}
            </Avatar>
          </Box>

          {/* Cột Nội dung bên phải */}
          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            {/* Bubble bình luận */}
            <Box
              id={comment.id}
              sx={{
                bgcolor: isOwnComment ? 'action.selected' : 'action.hover',
                borderRadius: '18px',
                px: 2,
                py: 1,
                display: 'inline-block',
                maxWidth: '100%',
                boxSizing: 'border-box',
                border: '1px solid transparent',
                '&.highlight-comment': {
                  borderColor: 'primary.light',
                  boxShadow: 1
                },
                '&:hover': {
                  boxShadow: 1
                }
              }}
            >
              <Typography variant="subtitle2" fontWeight="bold">
                {comment.userDisplayName || 'Người dùng ẩn'}
              </Typography>

              <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: 'pre-wrap' }}>
                {comment.content}
              </Typography>
            </Box>

            {/* Các nút hành động: Thời gian, Phản hồi, Chỉnh sửa */}
            <Stack direction="row" spacing={2} sx={{ mt: 0.5, ml: 1.5, alignItems: 'center' }}>
              <Typography variant="caption" color="text.secondary">
                {formatVNDate(comment.createdAt, "ddmmyyyyhhmm")}
                {comment.isEdited && ' (đã chỉnh sửa)'}
              </Typography>

              <Button
                onClick={() => {
                  if (!currentUser) {
                    setOpenLoginPrompt(true);
                    return;
                  }
                  setOpenReply(prev => !prev);
                }}
                variant="text"
                size="small"
                sx={{
                  minWidth: 0,
                  p: 0,
                  textTransform: 'none',
                  color: 'text.secondary',
                  fontWeight: 'bold',
                  '&:hover': { color: 'primary.main', bgcolor: 'transparent' }
                }}
              >
                {isOpenReply ? 'Hủy' : 'Phản hồi'}
              </Button>

              {isOwnComment && (
                <Button
                  variant="text"
                  size="small"
                  sx={{
                    minWidth: 0,
                    p: 0,
                    textTransform: 'none',
                    color: 'text.secondary',
                    fontWeight: 'bold',
                    '&:hover': { color: 'primary.main', bgcolor: 'transparent' }
                  }}
                >
                  Chỉnh sửa
                </Button>
              )}
            </Stack>

            {/* Form soạn phản hồi */}
            {isOpenReply && (
              <Box mt={1.5} mr={2}>
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

                <Stack direction="row" spacing={1}>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    disabled={!replyContent.trim()}
                    onClick={handleSendReply}
                  >
                    Gửi phản hồi
                  </Button>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleCancelReply}
                  >
                    Hủy
                  </Button>
                </Stack>
              </Box>
            )}
          </Box>
        </Box>

        {/* Đường dọc nối từ Avatar của comment cha xuống dưới (vẽ khi có replies để nối đến phần tử con / nút xem thêm) */}
        {comment.replies && comment.replies.length > 0 && (
          <Box
            sx={{
              position: 'absolute',
              left: isReply ? '16px' : '19px',
              top: isReply ? '32px' : '38px',
              bottom: '-8px', // Bù vào phần margin-top (8px) của phần tử replies con / nút xem thêm
              borderLeft: '2px solid',
              borderColor: 'divider',
              zIndex: 1,
            }}
          />
        )}
      </Box>

      {/* Khối chứa danh sách replies */}
      {comment.replies && comment.replies.length > 0 && (
        <>
          {/* Hiển thị replies nếu được expand */}
          {isExpanded && (
            <Box sx={{ pl: plValue, position: 'relative' }}>
              {comment.replies.map((reply, index) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  depth={depth + 1}
                  currentUser={currentUser}
                  onSendReply={onSendReply}
                  onDraftChange={onDraftChange}
                  isLastChild={index === comment.replies!.length - 1}
                />
              ))}
            </Box>
          )}

          {/* Hiển thị nút "Xem phản hồi" nếu đang ẩn */}
          {!isExpanded && (
            <Box sx={{ pl: plValue, position: 'relative' }}>
              <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center', position: 'relative', mt: 1 }}>
                {/* Khối chứa đường cong rẽ vào nút Xem phản hồi */}
                <Box sx={{ width: 32, height: 32, position: 'relative' }}>
                  <Box
                    sx={{
                      position: 'absolute',
                      left: `${repliesLineOffset}px`,
                      top: 0,
                      width: `${repliesCurveWidth + 32 + 12}px`, // Chạy dài đến sát text của nút Xem phản hồi
                      height: '16px',
                      borderLeft: '2px solid',
                      borderBottom: '2px solid',
                      borderColor: 'divider',
                      borderBottomLeftRadius: '10px',
                      zIndex: 1,
                    }}
                  />
                </Box>
                <Button
                  onClick={() => setIsExpanded(true)}
                  variant="text"
                  size="small"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 'bold',
                    color: 'text.secondary',
                    p: 0,
                    '&:hover': {
                      textDecoration: 'underline',
                      color: 'primary.main',
                      bgcolor: 'transparent',
                    }
                  }}
                >
                  Xem tất cả {comment.replies.length} phản hồi
                </Button>
              </Box>
            </Box>
          )}
        </>
      )}

      <LoginPromptDialog open={openLoginPrompt} onClose={() => setOpenLoginPrompt(false)} />
    </Box>
  );
});

export default CommentItem;