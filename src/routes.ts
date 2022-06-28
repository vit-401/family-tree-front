import {FC} from "react";
import Home from "./Pages/Home/Home";




const routes: RoutesTypes = [

    {path: '/', Component: Home},

]



export default routes;
export type  RoutesTypes = Array<RoutesObjTypes>
export type  RoutesObjTypes = {
    path: string
    Component: FC
    auth?: boolean
    exact?: boolean
    access?: Array<string>
    planIds?: Array<number>
}
