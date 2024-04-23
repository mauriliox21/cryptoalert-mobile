import { FormControl } from "native-base";
import { Switch } from "react-native";

type SwitchProps = {
    title: string;
    value: boolean;
    onValueChange: () => void;
}

export default function Switch2({ title, value, onValueChange }: SwitchProps){
    return (
        <FormControl flexDirection={"row"} alignItems="center">
            <FormControl.Label>{title}</FormControl.Label>
            <Switch 
                value={value}
                onValueChange={onValueChange}
                trackColor={{false: '#767577', true: '#dda129'}}
                thumbColor={'#f4f3f4'}
            />
        </FormControl>
    )
}