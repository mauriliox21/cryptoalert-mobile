import { HStack, Text, VStack, useToast } from "native-base";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup";
import { MaterialIcons, FontAwesome6  } from "@expo/vector-icons";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs"; 
import Select from "../components/Select";
import Input from "../components/Input";
import Button from "../components/Button";
import { RootStackParamList } from "../routes";
import { useEffect, useState } from "react";
import { AlertResponse, CryptocurrencyResponse, DefaultErrorResponse, DefaultGetResponse } from "../@types";
import { AxiosInstance } from "../config/AxiosInstace";
import { AxiosError, AxiosResponse } from "axios";
import Alert from "../components/Alert";
import Toast from "../components/Toast";
import Switch from "../components/Switch";

type IFormData = {
    cryptocurrency: string;
    alertType: string;
    targetValue: number;
    isActive?: boolean;
} 

const createAlertSchema = yup.object({
    cryptocurrency: yup.string().required("Informe a criptomoeda"),
    alertType: yup.string().required("Informe o tipo do alerta"),
    targetValue: yup.number().required("Informe o valor alvo").typeError("Informe o valor alvo").min(0.000001, "O valor minimo é 0,000001"),
    isActive: yup.boolean()
});

const handleChangeTargetValue = (value: string, onChange: Function) => {
    onChange(!value ? "0" : value.replace(",", "."));
}

const alertTypesList = [{description: "Aumento do valor", value: "TO_UP"}, {description: "Queda do Valor", value: "TO_DOWN"}];
export default function CreateAlert ({ navigation, route }: BottomTabScreenProps<RootStackParamList, "CreateAlert">){

    const toast = useToast();

    const [isUpdate, setIsUpdate] = useState<boolean>(false);

    const [cryptocurrencies, setCryptocurrencies] = useState<CryptocurrencyResponse[]>([]);

    const [isLoading, setIsLoading] = useState(true);

    const { control, handleSubmit, setValue, formState: { errors } } = useForm<IFormData>({
        resolver: yupResolver(createAlertSchema)
    });

    const handleAction = (data: IFormData) => {
        if(isUpdate)
            updateAlert(data);
        else
            saveNewAlert(data);
    }

    const getAllCryptocurrencies = () => {
        AxiosInstance.get("/cryptocurrencies")
        .then((res: AxiosResponse<DefaultGetResponse<CryptocurrencyResponse>, any>) => {
            setCryptocurrencies(res.data.content);
        })
        .catch((error) => {
            console.log(error.response?.status);
            console.log(error.response?.data);
        });
    }

    const saveNewAlert = (alert: IFormData) => {
        
        setIsLoading(true);
        AxiosInstance.post("/alerts", {
            nrTargetValue: alert.targetValue,
            idCryptocurrency: alert.cryptocurrency,
            tpAlert: alert.alertType
        })
        .then((res) => {
            closePage(true, "Alerta criado com sucesso!");
        })
        .catch((error: AxiosError<DefaultErrorResponse>) => {
            console.log(error.response?.status);
            console.log(error.response?.data);
            
            if(error.response?.data)
                showToast(error.response.data.message, "warning");
        })
        .finally(() => setIsLoading(false));
    }

    const getTargetAlert = () => {
        
        AxiosInstance.get(`/alerts/${route.params?.idAlert}`)
        .then((res: AxiosResponse<AlertResponse, any>) => {
            setValue('alertType', res.data.tpAlert);
            setValue('cryptocurrency', res.data.cryptocurrency.id.toString());
            setValue('targetValue', res.data.nrTargetValue);
            setValue('isActive', res.data.isActive);
            
        })
        .catch((error: AxiosError<DefaultErrorResponse>) => {
            console.log(error.response?.status);
            console.log(error.response?.data);
            
            if(error.response?.data)
                showToast(error.response.data.message, "warning");
            else
                showToast("Não foi possível completar a ação", "error");
        })
        .finally(() => setIsLoading(false));
        
    }

    const updateAlert = (alert: IFormData) => {
        setIsLoading(true);
        AxiosInstance.patch(`/alerts/${route.params?.idAlert}`, {
            nrTargetValue: alert.targetValue,
            idCryptocurrency: alert.cryptocurrency,
            tpAlert: alert.alertType,
            isActive: alert.isActive
        })
        .then(() => {
            closePage(true, "Alerta  alterado com sucesso!");
        })
        .catch((error: AxiosError<DefaultErrorResponse>) => {
            console.log(error.response?.status);
            console.log(error.response?.data);
            
            if(error.response?.data)
                showToast(error.response.data.message, "warning");
        })
        .finally(() => setIsLoading(false));
    }

    const closePage = (refresh: boolean, successMsg?: string) => {
        setValue('alertType', "");
        setValue('cryptocurrency', "");
        setValue('targetValue', 0);

        navigation.navigate("Alerts", {refreshList: refresh, successMsg: successMsg});
    }

    const showToast = (description: string, variant: "error" | "warning") => {
        toast.show({
            placement: "top" ,
            render: (({id}) => (
                <Toast 
                    title={variant === "warning" ? "Alerta" : "Erro"} 
                    description={description} 
                    variant={variant}
                    onPressClose={() => toast.close(id)} 
                />)), 
            duration: 1000 * 60 * 5
        })
    }

    useEffect(() => {
        getAllCryptocurrencies();
        if(route.params){
            getTargetAlert();
            setIsUpdate(true);
            setIsLoading(true);
        }
        else{
            setIsUpdate(false);
            setIsLoading(false);
        }
    }, [route]);

    return (
        <VStack flex={1} bg="#010101">
            <HStack bg="#333" h={"12"} px="4" alignItems="center" justifyContent="flex-start" space={4}>
                <MaterialIcons onPress={() => closePage(false)} name="chevron-left" size={24} color="#eee" />
                <Text flex={8} textAlign="center" color="#eee" fontSize={18} bold>ALERTA</Text>
                <MaterialIcons name="chevron-left" size={24} color="#eee" style={{opacity: 0}}/>
            </HStack>

            <VStack p={5} flex={9} space={2}>
                
                <Controller 
                    control={control} 
                    name="cryptocurrency"
                    render={({field: { onChange, value }}) => (
                        <Select 
                            title="Criptomoeda:" 
                            onValueChange={onChange} 
                            placeholder="Criptomoeda" 
                            items={cryptocurrencies.map(item => ({
                                description: item.nmCryptocurrency + " - " + item.txSymbol, 
                                value: item.id.toString()
                            }))}
                            errorMessage={errors.cryptocurrency?.message}
                            selectedValue={value}
                        />
                    )}
                />

                <Controller 
                    control={control} 
                    name="alertType"
                    render={({field: { onChange, value }}) => (
                        <Select 
                            title="Tipo:" 
                            placeholder="Tipo" 
                            onValueChange={onChange}
                            items={alertTypesList}
                            errorMessage={errors.alertType?.message}
                            selectedValue={value}
                        />
                    )}
                />

                <Controller 
                    control={control} 
                    name="targetValue"
                    render={({field: { onChange, value }}) => (
                        <Input 
                            InputLeftElement={<Text color="#eee" fontSize="18" pl={4}>R$</Text>}
                            title="Valor alvo:"
                            placeholder="0,00" 
                            keyboardType="decimal-pad"
                            onChangeText={(fildValue) => onChange(fildValue.replace(",", "."))} 
                            errorMessage={errors.targetValue?.message} 
                            value={value ? value.toLocaleString("pt-BR", {minimumFractionDigits: 2}).replace(".", ",") : undefined}
                        />
                    )}
                />
                
                {
                    isUpdate
                    &&
                    (<Controller 
                        control={control} 
                        name="isActive"
                        render={({field: { onChange, value }}) => (
                            <Switch
                                title="Ativo:"
                                onValueChange={onChange} 
                                value={value ?? false}
                            />
                        )}
                    />)
                }

                <VStack px={10} mt={10}>
                    <Button title={isUpdate ? "Alterar" : "Criar"} onPress={handleSubmit(handleAction)} isLoading={isLoading}/>
                </VStack>

            </VStack>
        </VStack>
    );
}