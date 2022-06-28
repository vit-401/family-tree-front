import {FC} from "react";
import Home from "./Pages/Home/Home";
import AddPerson from "./Pages/AddPerson/AddPerson";
import TablePerson from "./Pages/TablePerson/TablePerson";




const routes: RoutesTypes = [

    {path: '/add-person', Component: AddPerson},
    {path: '/edit-person/:id', Component: AddPerson},
    {path: '/table', Component: TablePerson},
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
