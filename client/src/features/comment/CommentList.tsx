import { Box, Button } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { CommentSignalRService } from "../../app/api/commentSignalRService";
import { useParams, useSearchParams } from "react-router-dom";
import { Comment, User } from "../../lib/types";
import CommentItem from "../../components/CommentItem";
import AddNewComment from "../../components/AddNewComment";
import { ReferenceTypes } from "../../lib/types";


type Props = {
  currentUser: User | undefined;
}

export default function CommentList({currentUser}: Props) {
  const { id } = useParams();
  const [comments, setComments] = useState<Comment[]>([]);
  const [draftCount, setDraftCount] = useState(0);
  const [searchParams] = useSearchParams();
  const commentId = searchParams.get("commentId");

  useEffect(() => {
    // console.log("commentId:", commentId);
    // console.log("list comments:", comments)
    if (commentId && comments.length > 0) {
      // Delay nhẹ để đợi DOM render xong
      requestAnimationFrame(() => {
        const element = document.getElementById(commentId);
        // console.log("element:", element);

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        element.classList.add("highlight-comment");
        // setTimeout(() => {
        //   element.classList.remove("highlight-comment");
        // }, 6000);
      }
    });
  }}, [commentId, comments]);


  function insertCommentToTree(commentTree: Comment[],newComment: Comment): Comment[] {
    // console.log(commentTree)
    const tmpComments = structuredClone(commentTree);
    if (newComment.parentCommentId == null) {
      return [newComment, ...tmpComments];
    }
    const insertRecursive = (comments: Comment[]): boolean => {
      for (const comment of comments) {
        if (comment.id === newComment.parentCommentId) {
          comment.replies.push({...newComment, replies: []});
          return true 
        }
        if (comment.replies.length > 0) {
          if (insertRecursive(comment.replies)) {
            return true;
          }
        }
      }
      return false
    }
    insertRecursive(tmpComments);
    return [...tmpComments]
  }

  useEffect(() => {
    let isMounted = true;
    if (!id) {
      console.error("Product ID is not provided in CommentList.");
      return;
    }
    const connectAndLoadComments = async () => {
      try {
        await CommentSignalRService.createHubConnection(id, false);
        if (!isMounted) return; // Kiểm tra sau mỗi bước await


        CommentSignalRService.loadAllComments(id, (loadedComments) => {
          if (isMounted) { 
            setComments(loadedComments);
          }
        });
        if (!isMounted) return; 

        CommentSignalRService.onReceiveNewComment((newComment) => {
          if (isMounted) { 
            setComments((prevComments) => insertCommentToTree(prevComments, newComment));
          }
        });

      } catch (error) {
        if (isMounted) {
          console.error("Error during SignalR connection setup or initial data load in CommentList:", error);
        }
      }
    };
    connectAndLoadComments();
    return () => {
      isMounted = false;
      // SignalRService.stopConnection() nên được thiết kế để an toàn khi gọi
      // ngay cả khi kết nối chưa được thiết lập hoàn chỉnh hoặc đã dừng.
      CommentSignalRService.stopConnection();
    };
  }, [id]); 

  const handleSendComment = async (content: string, parentId?: string) => {
    if (id && content.trim()) {
      // console.log("Sending comment:", content, "Product ID:", id);
      if (!parentId) {
        const result = await CommentSignalRService.sendComment(id, ReferenceTypes.Product, content);
        //send noti to admin group
        //send noti to personal user id (not me)
        //will check and send in commentitem (has parent comment id, and user that commented)
        return result as string;
      }
      else{
        const result = await CommentSignalRService.sendComment(id, ReferenceTypes.Product, content, parentId);
        return result as string;
      }
    }
    else {
      console.error("Some errors occurred while sending comment");
      console.log("Product ID:", id);
      console.log("Comment content:", content);
      return "";
    }
  }

  const handleDraftChange = useCallback((isDarfting: boolean) => {
    setDraftCount(prev => isDarfting ? prev + 1 : Math.max(0, prev - 1));
  }, [])
  return (
    <Box 
      maxWidth={'lg'}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        margin: '0 auto',
      }}
    >
      <Button sx={{ visibility: 'hidden' }} onClick={() => {console.log(draftCount)}}>test</Button>
      <AddNewComment onSendComment={handleSendComment} onDraftChange={handleDraftChange} currentUser={currentUser}/>
      <Box sx={{ mt: 2, fontWeight: 'bold' }}> 
        Danh sách bình luận:
      </Box>
      {comments.length === 0 ? (
        <Box textAlign="center" py={4} color="text.secondary">
          Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
        </Box>
      ) : (
        <>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              depth={0}
              currentUser={currentUser}
              onSendReply={handleSendComment}
              onDraftChange={handleDraftChange}
            />
          ))}
        </>
      )}
      {/* <YesNoDialog 
        title="Thông báo chuyển trang" 
        description="Hiện đang có ${draftCount} chưa hoàn thành, bạn có thật sự muốn rời trang?" 
        open={open}
        onClose={handleStay}
      /> */}
    </Box>
  );
}