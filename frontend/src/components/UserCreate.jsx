// in src/posts.tsx
import {
    Create,
    SimpleForm,
    ReferenceInput,
    TextInput,
} from "react-admin";

const UserCreate = () => (
    <Create>
        <SimpleForm>
            <ReferenceInput source="userId" reference="users" />
            <TextInput source="name" />
            <TextInput source="username" />
            <TextInput source="email" />
            <TextInput source="address.street" />
            <TextInput source="phone" />
            <TextInput source="website" />
            <TextInput source="company.name" />
        </SimpleForm>
    </Create>
);

export default UserCreate;