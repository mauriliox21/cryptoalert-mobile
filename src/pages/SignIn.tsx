import React, {useState} from "react";
import { VStack, ScrollView, Image, Heading, useToast } from "native-base";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup";
import Input from "../components/Input";
import Button from "../components/Button";
import { RootStackParamList } from "../routes";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { AxiosInstance } from "../config/AxiosInstace";
import { AxiosError } from "axios";
import { useUserRepository } from "../database/useUserRepository";
import Alert from "../components/Alert";
import { DetailsUserResponse } from "../@types";
import Toast from "../components/Toast";
import { UtilDevice } from "../util/UtilDevice";

type FormDataProps = {
    email: string;
    password: string;
} 

const signInSchema = yup.object({
    email: yup.string().required("Informe o e-mail"),
    password: yup.string().required("Informe a senha"),
});

export default function SignIn({ navigation }: BottomTabScreenProps<RootStackParamList, "SignIn">) {

    const toast = useToast();

    const [isLoading, setIsLoading] = useState(false);

    const userRepository = useUserRepository();

    const { control, handleSubmit, formState: { errors }, setValue } = useForm<FormDataProps>({
        resolver: yupResolver(signInSchema)
    });

    const handleSingUp = (data: FormDataProps) => {
        
        setIsLoading(true);
        
        AxiosInstance.post("/auth", {
            txEmail: data.email,
            txPassword: data.password
        })
        .then((res) => {

            userRepository.deleteAll();

            const accessToken = res.data.token;
            AxiosInstance.defaults.headers.common['Authorization'] = "Bearer " + accessToken;

            UtilDevice().saveDevice(() => {
                showToast("Não foi possível completar a ação", "error");
            });

            AxiosInstance.get("users/details")
            .then((res) => {

                setValue('email', "");
                setValue('password', "");
                const user: DetailsUserResponse = res.data;
                try{
                    userRepository.create({id: user.id, email: user.txEmail, name: user.nmUser, accessToken});
                    navigation.navigate("Alerts", {refreshList: true});
                }catch(error){
                    console.log("Error to saves user in local database");
                    console.log(error);
                }
            })
            .finally(() => {
                setIsLoading(false);
            });

        })
        .catch((error: AxiosError) => {
            console.log(error.response?.status);

            if(error.response?.status === 400)
                showToast("E-mail e/ou Senha inválidos", "warning");
            else
                showToast("Não foi possível completar a ação", "error");

                setIsLoading(false);        
        });
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

    return (
        <ScrollView flex={1} bg={"#010101"}>

            <VStack flex={1} alignItems="center" justifyContent="center" h="48">
                <Image source={require("../assets/logo.png")} size="xl" resizeMode="contain" alt="Cryptoalert" />
            </VStack>

            <VStack flex={2} px='5' space='5'>

                <Heading alignSelf="center" color="#eee">Acesse sua conta</Heading>

                <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, value } }) => (
                        <Input placeholder="E-mail" onChangeText={onChange} errorMessage={errors.email?.message} value={value}/>
                    )}
                />

                <Controller
                    control={control}
                    name="password"
                    render={({ field: { onChange, value } }) => (
                        <Input placeholder="Senha" onChangeText={onChange} secureTextEntry errorMessage={errors.password?.message} value={value}/>
                    )}
                />

                <VStack px="10">
                    <Button title="Acessar" onPress={handleSubmit(handleSingUp)} isLoading={isLoading}/>
                </VStack>

                <VStack px="10">
                    <Button 
                        title="Criar uma conta" 
                        onPress={() => {
                            setValue('email', "");
                            setValue('password', "");
                            navigation.navigate("SignUp");
                        }} 
                        disabled={isLoading}
                    />
                </VStack>

            </VStack>


        </ScrollView>
    );
}