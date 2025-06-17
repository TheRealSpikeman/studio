
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Brain, Zap, Sparkles, Compass, ShieldAlert, Info, Users, CheckSquare } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const neurodiversityTopics = [
  {
    id: "algemeen",
    title: "Wat is Neurodiversiteit?",
    icon: Brain,
    shortDescription: "Een introductie tot het concept dat ieders brein uniek is en anders werkt.",
    content: [
      "Neurodiversiteit is het idee dat verschillen in hersenfunctie en gedragskenmerken normale variaties zijn binnen de menselijke bevolking. Net zoals we verschillen in lengte, haarkleur of talenten, zo verschillen onze breinen ook in hoe ze informatie verwerken, leren, en de wereld ervaren.",
      "Termen zoals ADD/ADHD, autisme (ASS), hoogsensitiviteit (HSP), dyslexie en dyscalculie vallen onder de noemer neurodivergentie. Dit betekent dat de hersenen op een andere manier informatie verwerken dan wat als 'neurotypisch' (de meest voorkomende manier) wordt beschouwd.",
      "Het is belangrijk om te onthouden dat neurodiversiteit geen ziekte of stoornis is die 'genezen' moet worden. Het gaat om het erkennen en waarderen van deze verschillen, het begrijpen van zowel de sterke kanten als de uitdagingen die hiermee gepaard kunnen gaan, en het creëren van een omgeving waarin iedereen kan floreren."
    ],
    imageUrl: "https://placehold.co/600x400.png?text=Diversiteit+Brein",
    dataAiHint: "brain diversity"
  },
  {
    id: "add",
    title: "ADD (Attention Deficit Disorder)",
    icon: Brain,
    shortDescription: "Kenmerken van onoplettendheid, dromerigheid, en moeite met focus.",
    content: [
      "Kinderen en jongeren met kenmerken van ADD (vaak het overwegend onoplettende subtype van ADHD genoemd) hebben voornamelijk moeite met aandacht en concentratie. Ze kunnen dromerig of afwezig lijken, en hebben vaak moeite om taken te starten of af te maken, vooral als deze saai of repetitief zijn. Hyperactiviteit is bij ADD minder op de voorgrond of afwezig.",
      "**Herkenbare punten voor ouders:**",
      "- Moeite met het vasthouden van aandacht bij schoolwerk of spel.",
      "- Lijkt vaak niet te luisteren als er direct gesproken wordt.",
      "- Volgt instructies niet goed op en maakt taken vaak niet af.",
      "- Moeite met het organiseren van taken en activiteiten.",
      "- Vermijdt, heeft een hekel aan of is onwillig om taken te doen die langdurige mentale inspanning vereisen (zoals schoolwerk of huiswerk).",
      "- Raakt vaak dingen kwijt die nodig zijn voor taken of activiteiten (bv. schoolspullen, sleutels).",
      "- Is gemakkelijk afgeleid door externe prikkels.",
      "- Is vergeetachtig bij dagelijkse bezigheden."
    ],
    colorClass: "border-blue-500",
    bgClass: "bg-blue-50"
  },
  {
    id: "adhd",
    title: "ADHD (Attention Deficit Hyperactivity Disorder)",
    icon: Zap,
    shortDescription: "Kenmerken van hyperactiviteit, impulsiviteit en aandachtsproblemen.",
    content: [
      "ADHD wordt gekenmerkt door een patroon van onoplettendheid en/of hyperactiviteit-impulsiviteit dat interfereert met functioneren of ontwikkeling. Jongeren met ADHD kunnen moeite hebben met stilzitten, wachten op hun beurt, en het beheersen van impulsen. Ze kunnen ook snel afgeleid zijn en moeite hebben met het organiseren van taken.",
      "**Herkenbare punten voor ouders (hyperactiviteit/impulsiviteit):**",
      "- Beweegt vaak onrustig met handen of voeten, of draait op de stoel.",
      "- Staat vaak op in situaties waar verwacht wordt dat men blijft zitten.",
      "- Rent vaak rond of klimt overal op in situaties waarin dit ongepast is.",
      "- Kan moeilijk rustig spelen of zich bezighouden met ontspannende activiteiten.",
      "- Is vaak 'in de weer' of 'draaft maar door'.",
      "- Praat vaak excessief.",
      "- Gooit het antwoord er al uit voordat de vraag volledig gesteld is.",
      "- Heeft moeite op zijn/haar beurt te wachten.",
      "- Verstoort vaak bezigheden van anderen of dringt zich op."
    ],
    colorClass: "border-orange-500",
    bgClass: "bg-orange-50"
  },
  {
    id: "hsp",
    title: "HSP (Hoogsensitief Persoon)",
    icon: Sparkles,
    shortDescription: "Diepgaande verwerking van prikkels, empathie en gevoeligheid voor omgeving.",
    content: [
      "Hoogsensitiviteit is een persoonlijkheidskenmerk waarbij prikkels (zoals geluiden, licht, geuren, maar ook emoties van anderen) intenser en gedetailleerder worden waargenomen en verwerkt. Dit kan leiden tot een rijk innerlijk leven en grote empathie, maar ook tot snellere overprikkeling.",
      "**Herkenbare punten voor ouders:**",
      "- Merkt subtiele details en nuances op die anderen vaak ontgaan.",
      "- Is gevoelig voor stemmingen en emoties van anderen.",
      "- Kan overweldigd raken door fel licht, harde geluiden, sterke geuren of drukke omgevingen.",
      "- Heeft vaak meer tijd nodig om bij te komen na drukke of intense activiteiten.",
      "- Denkt diep na over dingen en stelt vaak diepzinnige vragen.",
      "- Is vaak zorgzaam en gewetensvol.",
      "- Kan moeite hebben met plotselinge veranderingen of verrassingen.",
      "- Is gevoelig voor pijn, cafeïne of medicatie."
    ],
    colorClass: "border-purple-500",
    bgClass: "bg-purple-50"
  },
  {
    id: "ass",
    title: "ASS (Autismespectrumstoornis) Kenmerken",
    icon: Compass,
    shortDescription: "Behoefte aan structuur, specifieke interesses en andere sociale interactie.",
    content: [
      "Autisme is een ontwikkelingsvariant die invloed heeft op hoe iemand communiceert, sociale interacties aangaat en de wereld ervaart. Kinderen en jongeren met kenmerken van autisme hebben vaak een sterke behoefte aan structuur, routine en voorspelbaarheid. Ze kunnen intense, specifieke interesses hebben en informatie op een gedetailleerde manier verwerken.",
      "**Herkenbare punten voor ouders:**",
      "- Moeite met het initiëren of onderhouden van sociale interacties; kan onhandig overkomen.",
      "- Beperkt gebruik of begrip van non-verbale communicatie (oogcontact, gezichtsuitdrukkingen, gebaren).",
      "- Moeite met het ontwikkelen, onderhouden en begrijpen van relaties.",
      "- Sterke voorkeur voor routines en weerstand tegen veranderingen.",
      "- Zeer specifieke, soms intense interesses.",
      "- Herhalende gedragingen of bewegingen (stereotypieën).",
      "- Over- of ondergevoeligheid voor zintuiglijke prikkels (geluid, licht, textuur, etc.).",
      "- Letterlijk taalbegrip; moeite met sarcasme, ironie of figuurlijk taalgebruik."
    ],
    colorClass: "border-teal-500",
    bgClass: "bg-teal-50"
  },
  {
    id: "angst-depressie",
    title: "Angst & Depressie Kenmerken",
    icon: ShieldAlert,
    shortDescription: "Aanhoudende zorgen, somberheid, en impact op dagelijks functioneren.",
    content: [
      "Angst- en depressieve klachten komen vaak voor bij jongeren. Angst kan zich uiten in overmatig piekeren, nervositeit, vermijdingsgedrag en fysieke symptomen zoals hartkloppingen of buikpijn. Depressieve kenmerken omvatten aanhoudende somberheid, verlies van interesse of plezier, vermoeidheid en veranderingen in slaap of eetlust.",
      "**Herkenbare punten bij angst voor ouders:**",
      "- Overmatige zorgen over alledaagse dingen (school, vrienden, gezondheid).",
      "- Rusteloosheid of een 'opgejaagd' gevoel.",
      "- Snel geïrriteerd.",
      "- Moeite met concentreren.",
      "- Spierspanning, hoofdpijn, buikpijn zonder duidelijke medische oorzaak.",
      "- Slaapproblemen (moeite met inslapen, doorslapen, of onrustige slaap).",
      "- Vermijden van bepaalde situaties of plaatsen uit angst.",
      "**Herkenbare punten bij depressie voor ouders:**",
      "- Aanhoudende sombere of prikkelbare stemming gedurende het grootste deel van de dag.",
      "- Duidelijk verminderde interesse of plezier in (bijna) alle activiteiten.",
      "- Significant gewichtsverlies (zonder dieet) of gewichtstoename, of verandering in eetlust.",
      "- Slaapproblemen (te veel of te weinig slapen).",
      "- Psychomotorische agitatie (onrust) of remming (traagheid), waarneembaar door anderen.",
      "- Vermoeidheid of verlies van energie.",
      "- Gevoelens van waardeloosheid of overmatige/onterechte schuldgevoelens.",
      "- Verminderd vermogen tot nadenken of concentreren, of besluiteloosheid.",
      "- Terugkerende gedachten aan de dood, suïcidale gedachten zonder specifiek plan, of een suïcidepoging of een specifiek plan daarvoor."
    ],
    colorClass: "border-red-500",
    bgClass: "bg-red-50"
  }
];

export default function NeurodiversiteitPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 bg-gradient-to-b from-background via-secondary/10 to-background py-12 md:py-20 lg:py-28">
        <div className="container mx-auto">
          <Card className="shadow-xl max-w-4xl mx-auto">
            <CardHeader className="text-center pb-8">
              <Brain className="mx-auto h-16 w-16 text-primary mb-4" />
              <CardTitle className="text-4xl font-bold text-foreground">Wat is Neurodiversiteit?</CardTitle>
              <CardDescription className="text-lg text-muted-foreground mt-2">
                Een gids voor ouders om de unieke denkstijlen en behoeften van hun kind beter te begrijpen.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-10 text-lg leading-relaxed text-foreground/90">
              
              {neurodiversityTopics.filter(topic => topic.id === "algemeen").map(topic => (
                <section key={topic.id} className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-3">
                    {topic.content.map((paragraph, pIndex) => <p key={pIndex}>{paragraph}</p>)}
                  </div>
                   <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
                    <Image
                        src={topic.imageUrl!}
                        alt={topic.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        data-ai-hint={topic.dataAiHint}
                    />
                  </div>
                </section>
              ))}

              <Accordion type="single" collapsible className="w-full space-y-4">
                {neurodiversityTopics.filter(topic => topic.id !== "algemeen").map((topic) => {
                  const IconComponent = topic.icon;
                  return (
                    <AccordionItem 
                        key={topic.id} 
                        value={topic.id} 
                        className={`rounded-lg border-2 ${topic.colorClass} ${topic.bgClass} shadow-md hover:shadow-lg transition-shadow`}
                    >
                      <AccordionTrigger className="text-left font-semibold hover:no-underline py-5 px-6 text-xl data-[state=open]:text-primary [&[data-state=open]>svg]:text-primary">
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-7 w-7 text-primary" />
                          {topic.title}
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-6 pb-6 pt-2 text-base leading-relaxed text-foreground/80 bg-card rounded-b-lg">
                        <p className="italic text-muted-foreground mb-4">{topic.shortDescription}</p>
                        {topic.content.map((paragraph, pIndex) => {
                            if (paragraph.startsWith("**Herkenbare punten voor ouders:**")) {
                                return <p key={pIndex} className="font-semibold mt-3 mb-1">{paragraph.replace("**Herkenbare punten voor ouders:**", "Herkenbare punten voor ouders:")}</p>;
                            }
                            if (paragraph.startsWith("- ")) { // Check for list items
                                return <li key={pIndex} className="ml-5 list-disc">{paragraph.substring(2)}</li>;
                            }
                            return <p key={pIndex} className="mb-2">{paragraph}</p>;
                         })}
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>

              <Card className="mt-12 bg-blue-50 border-blue-200 text-blue-700 p-6 rounded-lg shadow-md">
                <CardHeader className="p-0 pb-3">
                    <CardTitle className="flex items-center gap-3 text-xl">
                        <CheckSquare className="h-7 w-7"/>
                        MindNavigator: Inzicht, Geen Diagnose
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-0 space-y-3 text-base leading-relaxed">
                  <p>
                    MindNavigator is ontworpen om u en uw kind te helpen bij het verkrijgen van zelfinzicht en het ontdekken van persoonlijke sterktes en uitdagingen. Onze quizzen en tools bieden waardevolle informatie en praktische tips.
                  </p>
                  <p>
                    Het is echter belangrijk te benadrukken dat MindNavigator <strong>geen</strong> medische of psychologische diagnoses stelt. De resultaten zijn indicatief en bedoeld voor zelfreflectie en educatie.
                  </p>
                  <p>
                    Als u zich zorgen maakt over de ontwikkeling of het welzijn van uw kind, of als u een formele diagnose overweegt, adviseren wij u altijd contact op te nemen met een gekwalificeerde professional, zoals een huisarts, kinderarts, psycholoog of orthopedagoog.
                  </p>
                   <Button asChild variant="link" className="p-0 h-auto text-blue-700 hover:text-blue-800">
                        <Link href="/contact">Neem contact op voor meer informatie</Link>
                   </Button>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
