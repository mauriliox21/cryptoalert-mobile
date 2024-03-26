import { useState } from "react";
import { VStack, Image, Heading, ScrollView, useToast } from "native-base";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { AxiosError, AxiosResponse } from "axios";
import { AxiosInstance } from "../config/AxiosInstace";
import { useUserRepository } from "../database/useUserRepository";
import { DefaultErrorResponse, DetailsUserResponse } from "../@types";
import Input from "../components/Input";
import Button from "../components/Button";
import Toast from "../components/Toast";
import { UtilDevice } from "../util/UtilDevice";
import { RootStackParamList } from "../routes";

type FormDataProps = {
    name: string;
    email: string;
    password: string;
    passwordConfirm: string;
} 

const signUpSchema = yup.object({
    name: yup.string().required("Informe o nome"),
    email: yup.string().required("Informe o e-mail").email("E-mail inválido"),
    password: yup.string().required("Informe a senha").min(8, "A senha deve ter pelo menos 8 dígitos"),
    passwordConfirm: yup.string().required("Informe a confiirmação de senha").oneOf([yup.ref("password") || null], "A confirmação de senha não é igual")
});

export default function SignUp({ navigation }: BottomTabScreenProps<RootStackParamList, "SignUp">) {

    const toast = useToast();

    const userRepository = useUserRepository();
    const [isLoading, setIsLoading] = useState(false);

    const { control, handleSubmit, formState: { errors }, setValue } = useForm<FormDataProps>({
        resolver: yupResolver(signUpSchema)
    });

    const handleSingUp = (data: FormDataProps) => {
        setIsLoading(true);

        AxiosInstance.post("/users", {
            nmUser: data.name,
            txEmail: data.email,
            txPassword: data.password
        })
        .then(() => {
            authenticate(data);
        })
        .catch((error: AxiosError<DefaultErrorResponse>) => {
            console.log(error.response?.status);

            if(error.response?.data)
                showToast(error.response?.data?.message, "warning");

            setIsLoading(false);        
        });
    }

    const authenticate = (data: FormDataProps) => {
        AxiosInstance.post("/auth", {
            txEmail: data.email,
            txPassword: data.password
        })
        .then((res) => {
            userRepository.deleteAll();
            AxiosInstance.defaults.headers.common['Authorization'] = "Bearer " + res.data.token;
            getDetails(res.data.token);
            UtilDevice().saveDevice(() => {
                showToast("Não foi possível completar a ação", "error");
            });
        })
        .catch((error: AxiosError<DefaultErrorResponse>) => {
            console.log(error.response?.status);

            if(error.response?.status === 400)
                showToast("E-mail e/ou Senha inválidos", "warning");
            else
                showToast("Não foi possível completar a ação", "error");

                setIsLoading(false);        
        });
    }

    const getDetails = (accessToken: string) => {
        AxiosInstance.get("users/details")
        .then((res: AxiosResponse<DetailsUserResponse>) => {

            const user = res.data;
            try{
                userRepository.create({id: user.id, email: user.txEmail, name: user.nmUser, accessToken});
                navigation.navigate("Alerts", {refreshList: true});
                setValue("email", "");
                setValue("name", "");
                setValue("password", "");
                setValue("passwordConfirm", "");
            }catch(error){
                console.log("Error to saves user in local database");
                console.log(error);
            }
        })
        .finally(() => {
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
                
                <Heading alignSelf="center" color="#eee">Crie sua conta</Heading>

                <Controller
                    control={control}
                    name="name"
                    render={({field: {onChange, value}}) => (
                        <Input placeholder="Nome" onChangeText={onChange} errorMessage={errors.name?.message} value={value}/>
                    )}
                />

                <Controller
                    control={control}
                    name="email"
                    render={({field: {onChange, value}}) => (
                        <Input placeholder="E-mail" onChangeText={onChange} errorMessage={errors.email?.message} value={value}/>
                    )}
                />

                <Controller
                    control={control}
                    name="password"
                    render={({field: {onChange, value}}) => (
                        <Input placeholder="Senha" onChangeText={onChange} secureTextEntry errorMessage={errors.password?.message} value={value}/>
                    )}
                />

                <Controller
                    control={control}
                    name="passwordConfirm"
                    render={({field: {onChange, value}}) => (
                        <Input placeholder="Confirme a Senha" onChangeText={onChange} secureTextEntry errorMessage={errors.passwordConfirm?.message} value={value}/>
                    )}
                />

                <VStack px="10">
                    <Button title="Cadastrar" onPress={handleSubmit(handleSingUp)} isLoading={isLoading}/>
                </VStack>

                <VStack px="10">
                    <Button 
                        title="Acessar minha conta" 
                        onPress={() => {
                            setValue("email", "");
                            setValue("name", "");
                            setValue("password", "");
                            setValue("passwordConfirm", "");
                            navigation.navigate("SignIn");
                        }} 
                        isDisabled={isLoading}/>
                </VStack>

            </VStack>

        </ScrollView>
    );
}