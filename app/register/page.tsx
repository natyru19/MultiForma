import { Suspense } from "react";
import RegisterForm from "./RegisterForm";

export default function RegisterPage() {

    return (
        <Suspense fallback={<p>Cargando...</p>}>
            <RegisterForm />
        </Suspense>
    );
}