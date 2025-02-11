import Select, { MultiValue } from "react-select";

type Option = {
  value: number;
  label: string;
};

type OptionsProps = {
  options: { id: number; name: string }[];
  setOptions: (options: { id: number }[]) => void;
};

export const Options: React.FC<OptionsProps> = ({ options, setOptions }) => {
  let selectOptions: { value: number; label: string }[] = [];
  if (options) {
    selectOptions.push(
      ...options.map((option) => ({
        value: option.id,
        label: option.name,
      })),
    );
  }

  const handleSelect = (selectedOptions: MultiValue<Option | null>) => {
    const parsedOptions = (selectedOptions || []).filter(
      (option): option is Option => option !== null,
    );
    setOptions(parsedOptions.map((option) => ({ id: option.value })));
  };

  return (
    <div className="flex place-items-center items-center justify-center">
      <Select
        isMulti
        defaultValue={null}
        options={selectOptions}
        onChange={handleSelect}
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: "hsl(var(--primary))",
            primary25: "hsl(var(--secondary))",
            primary50: "hsl(var(--secondary))",
            dangerLight: "hsl(var(--primary))",
            danger: "hsl(var(--secondary))",
          },
        })}
      />
    </div>
  );
};
