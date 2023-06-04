import { useParams } from "@remix-run/react"

export default function TodoRoute() {
  const params = useParams()
  
  return (
    <h1>todoId: {params.todoId}</h1>
  )
}
