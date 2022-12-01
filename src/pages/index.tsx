import { FormEvent, useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmi(e: FormEvent) {
    e.preventDefault();

    const data = { email, password };

    console.log(data);
  }

  return (
    <form onSubmit={handleSubmi}>
      <Input
        type="email"
        name="email"
        id="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        type="password"
        name="password"
        id="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button type="submit">Clicar</Button>
    </form>
  );
}
