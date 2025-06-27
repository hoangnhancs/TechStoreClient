import { Button } from "@mui/material";
import { useNavigate } from "react-router";

export default function HomePage() {
  const navigate = useNavigate()

  return (
    
    <>
      <div>HomePage</div>
      <Button onClick={() => navigate('/products')}>Tech Store</Button>
    </>
    
  )
}