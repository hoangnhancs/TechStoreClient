import { Grid, Typography } from "@mui/material";
import CheckOutStepper from "../../layouts/CheckOutStepper";
import OrderSummary from "./OrderSummary";
import { useAppSelector } from "../../hooks";
import {loadStripe, StripeElementsOptions} from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { useMemo } from "react";
import { useCreatePaymentIntentMutation } from "./orderApi";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK)

export default function CheckOutPage() {
  const {basket, selectedItems} = useAppSelector(state => state.basket)
  const [createPaymentIntent, {isLoading}] = useCreatePaymentIntentMutation()
  const options: StripeElementsOptions | undefined = useMemo(() => {
    if (!basket?.clientSecret) return undefined
    return {
      clientSecret: basket.clientSecret,
    }
  }, [basket?.clientSecret])
  return (
    <Grid container spacing={2}>
      <Grid size={8} >
        {!stripePromise || !options ? (
          <Typography variant="h6">Loading...</Typography>
        ): (
          <Elements stripe={stripePromise} options={options}>
            <CheckOutStepper />
          </Elements>
        )}  
      </Grid>
      <Grid size={4} >
        <OrderSummary basket={basket} selectedItems={selectedItems} />
      </Grid>
    </Grid>
  )
}