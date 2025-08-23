interface Props {
  listingsCount: number;
}

export function About({ listingsCount }: Props) {
  return (
    <div className="relative border border-gruvbox-bg1 p-4">
      <h2 className="absolute z-10 -top-3 left-4 bg-gruvbox-bg1">O Stránce</h2>
      <p>
        V dnešní době je těžké najít práci v oboru IT, zvlášť na juniorní
        pozici. Proto jsem vytvořil tento malý web, kde lze snadno sledovat
        aktuální nabídky práce. Momentálně je zobrazeno{" "}
        <span className="text-gruvbox-green font-black">{listingsCount}</span>
        {" "}
        nabídek.

        {
          /*
        Pro kontakt s administrátorem webu můžete využít{" "}
        <a
          href="mailto:ondrejtucek9@gmail.com"
          className="text-gruvbox-aqua underline"
        >
          e-mail
        </a>
        */
        }
      </p>
    </div>
  );
}
