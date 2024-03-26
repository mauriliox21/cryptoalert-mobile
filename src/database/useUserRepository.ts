import { useSQLiteContext } from "expo-sqlite/next";

export type UserCreateDatabase = {
    id: number;
    name: string;
    email: string;
    accessToken: string;
}

export function useUserRepository(){

    const database = useSQLiteContext();

    function create(user: UserCreateDatabase){
        try{
            const statement = database.prepareSync(
                "INSERT INTO user (id, name, email, access_token) values ($id, $name, $email, $accessToken)"
            );
        
            statement.executeSync({
                $id: user.id,
                $name: user.name,
                $email: user.email,
                $accessToken: user.accessToken,
            });
        } catch (error){
            throw error
        }
    }

    function getToken(){
        const ln: any = database.getFirstSync<string>(
            "SELECT u.access_token FROM user AS u"
        );

        if(ln !== null && ln !== undefined)
            return ln.access_token;
        else
            return null;
    }


    function getName(){
        const ln: any = database.getFirstSync(
            "SELECT u.name FROM user AS u"
        );

        if(ln !== null && ln !== undefined)
            return ln.name;
        else
            return null;
    }

    function deleteAll(){
        try{
            const statement = database.prepareSync(
                "DELETE FROM user"
            );
        
            statement.executeSync();
        } catch (error){
            throw error
        }
    }

    return {
        create,
        getToken,
        getName,
        deleteAll,
    }
}