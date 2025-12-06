import { Section } from "~/components/section"

const SONGS = {
  classic: {
    title: "classic",
    songs: [
      { title: "Meeple Circus Theme", src: "mc-theme.mp3" },
      { title: "East West Rag", src: "mc-east-west-rag.mp3" },
      { title: "Nuts", src: "mc-nuts.mp3" }
    ]
  },
  themes: {
    title: "themes", songs:
      [
        { title: "Metal Circus", src: "mc-metal-circus.mp3" },
        { title: "Retrogaming Circus", src: "mc-retrogaming-circus.mp3" },
        { title: "Carnival Circus", src: "mc-carnival-circus.mp3" },
        { title: "Comedy Klezmer Circus", src: "mc-comedy-klezmer-circus.mp3" },
      ]
  },
  challenges: {
    title: "challenges",
    songs: [
      { title: "Karaoke", src: "mc-challenge-singing.mp3" },
      { title: "Thank You", src: "mc-challenge-applause.mp3" },
      { title: "I Love You", src: "mc-challenge-applause.mp3" },
      { title: "Moaner", src: "mc-challenge-raleur.mp3" },
    ]

  }, director: {
    title: "director",
    songs: [
      { title: "accelerate 1", src: "mc-on-accelere-1er.mp3" },
      { title: "accelerate 2", src: "mc-on-accelere-2e.mp3" }
    ]
  }, christmas: {
    title: "christmas",
    songs: [
      { title: "Jingle Bells Circus", src: "mc-jingle-bells-circus.mp3" },
      { title: "I Love Winter", src: "mc-i-love-winter.mp3" }
    ]
  }
}

export default function UtilsMeepleCircusPage() {
  console.log({ SONGS })

  return (
    <main className="min-h-[calc(100dvh-56px)]">
      <Section>
        <div className="mt-16 mb-8 ml-4">
          <h1 className="text-xl font-semibold sm:text-3xl">
            Meeple Circus
          </h1>

          <div className="flex gap-2">
            <p>board game timer</p>
          </div>
        </div>

        <div>
          {/* TODO: songs dropdown */ }
        </div>
      </Section>
    </main>
  )
}
