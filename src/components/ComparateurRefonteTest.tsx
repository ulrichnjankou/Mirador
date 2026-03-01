import { ComparateurRefonte } from "./ComparateurRefonte";

interface ComparateurRefonteTestProps {
  onComplete?: (subscriptionId: string) => void;
}

export function ComparateurRefonteTest({ onComplete }: ComparateurRefonteTestProps) {
  const handleComplete = (subscriptionId: string) => {
    console.log("Souscription complétée :", subscriptionId);
    if (onComplete) {
      onComplete(subscriptionId);
    }
  };

  return (
    <div className="min-h-screen">
      <ComparateurRefonte onComplete={handleComplete} />
    </div>
  );
}
