
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function Dashboard() {
  const [events, setEvents] = useState([]);
  useEffect(() => {
    const s = io("http://localhost:4000", {
      transports: ["websocket"],
      auth: { token: localStorage.getItem("token") },
    });
    s.on("order:new", (o) => setEvents((e) => [{ type:"new", o }, ...e]));
    s.on("order:updated", (o) => setEvents((e) => [{ type:"upd", o }, ...e]));
    return () => s.disconnect();
  }, []);
  return <pre>{JSON.stringify(events, null, 2)}</pre>;
}
