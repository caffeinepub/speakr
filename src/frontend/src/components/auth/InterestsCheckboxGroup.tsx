import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

interface InterestsCheckboxGroupProps {
  interests: string[];
  selectedInterests: string[];
  onChange: (selected: string[]) => void;
}

export default function InterestsCheckboxGroup({
  interests,
  selectedInterests,
  onChange,
}: InterestsCheckboxGroupProps) {
  const handleCheckboxChange = (interest: string, checked: boolean) => {
    if (checked) {
      onChange([...selectedInterests, interest]);
    } else {
      onChange(selectedInterests.filter((i) => i !== interest));
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto p-1">
      {interests.map((interest) => (
        <div key={interest} className="flex items-center space-x-2">
          <Checkbox
            id={`interest-${interest}`}
            checked={selectedInterests.includes(interest)}
            onCheckedChange={(checked) => handleCheckboxChange(interest, checked as boolean)}
          />
          <Label
            htmlFor={`interest-${interest}`}
            className="text-sm font-normal cursor-pointer"
          >
            {interest}
          </Label>
        </div>
      ))}
    </div>
  );
}
