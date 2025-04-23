import { useAppDispatch, useAppSelector } from "../../hooks"
import { decrement, increment } from "./counterSlice"

export default function Counter() {

    const count = useAppSelector(state => state.counter.count)
    const dispatch = useAppDispatch()
  return (
    <div>
        <h2>Counter {count}</h2>
        <button onClick={() => dispatch(increment({amount:3}))}>+</button>
        <button onClick={() => dispatch(decrement({amount:3}))}>-</button>
    </div>
  )
}