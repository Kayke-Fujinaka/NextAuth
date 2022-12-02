import { FormEvent, useContext, useState } from "react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { AuthContext } from "../contexts/AuthContext";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { signIn } = useContext(AuthContext);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const data = { email, password };

    await signIn(data);
  }

  return (
    <form onSubmit={handleSubmit}>
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
