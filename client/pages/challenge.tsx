import { useForm } from "@westbrookdaniel/form/react";
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { trpc } from "../trpc";

type Props = {
  id: string;
};

export function Challenge({ id }: Props) {
  const c = trpc.challenge.challengeById.useQuery({ id });
  return (
    <main className="max-w-4xl mx-auto px-4 pb-8 pt-16">
      <h1 className="text-2xl font-bold">
        Declare Winner{c.data ? ` for ${c.data.date}` : ""}
      </h1>
      <p>
        {c.data
          ? `${c.data.player1.name} vs ${c.data.player2.name}`
          : "... vs ..."}
      </p>
      <Form id={id} />
    </main>
  );
}

type FormState = {
  winner?: string;
  info?: string;
};

type FormErrors = {
  winner?: string;
  info?: string;
  general?: string;
};

function Form({ id }: Props) {
  const [_location, setLocation] = useLocation();
  const utils = trpc.useContext();
  const c = trpc.challenge.challengeById.useQuery({ id });
  const declareWinner = trpc.challenge.declareWinner.useMutation({
    onSuccess: () => {
      utils.challenge.invalidate();
    },
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const form = useForm<FormState>({
    onSubmit: async (s, form) => {
      const { info } = s;

      // TODO: this is a bug in the form library
      const data = new FormData(form);
      const winner = data.get("winner");

      if (typeof winner !== "string" || !winner) {
        return setErrors({ winner: "Winner is required" });
      }
      if (!info) return setErrors({ info: "Info is required" });
      setErrors({});
      try {
        await declareWinner.mutateAsync({ id, winner, info });
        setLocation("/");
      } catch (err: any) {
        setErrors({ general: err?.message || "Something went wrong" });
      }
    },
  });

  return (
    <form className="max-w-sm mt-4" ref={form}>
      <fieldset className="block">
        <legend>Who was the winner? </legend>
        <div className="mt-2">
          <div>
            <label className="inline-flex items-center">
              <input
                className="form-radio"
                type="radio"
                name="winner"
                value="player1"
              />
              <span className="ml-2">{c.data?.player1.name ?? "Player 1"}</span>
            </label>
          </div>
          <div>
            <label className="inline-flex items-center">
              <input
                className="form-radio"
                type="radio"
                name="winner"
                value="player2"
              />
              <span className="ml-2">{c.data?.player2.name ?? "Player 2"}</span>
            </label>
          </div>
          <div>
            <label className="inline-flex items-center">
              <input
                className="form-radio"
                type="radio"
                name="winner"
                value="draw"
              />
              <span className="ml-2">Draw</span>
            </label>
          </div>
        </div>
        <span className="text-red-500 text-sm">{errors.winner}</span>
      </fieldset>

      <label className="block mt-4">
        <span>What did you do for the challenge?</span>
        <input
          id="info"
          name="info"
          className="mt-1 block w-full rounded-md border-stone-300 shadow-sm focus:border-stone-400 focus:ring focus:ring-stone-300 focus:ring-opacity-50"
          placeholder=""
        />
        <span className="text-red-500 text-sm">{errors.info}</span>
      </label>
      <div className="flex space-x-2 mt-6">
        <Link href="/">
          <a className="button">Cancel</a>
        </Link>
        <button type="submit" className="primary">
          Submit
        </button>
      </div>
      <p className="text-red-500 mt-2">{errors.general}</p>
    </form>
  );
}
