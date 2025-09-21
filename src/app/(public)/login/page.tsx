"use client";
import { useForm } from "@tanstack/react-form";
import { loginSchema, type LoginType, nullFormState } from "./_components/formSchema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FieldInfo } from "@/components/forms/FieldInfo";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { login } from "../(actions)/loginAction";
import { useAction } from "next-safe-action/hooks";
import { Landmark, LockKeyhole, Mail } from "lucide-react";
import Spinner from "@/components/Spinner";

export default function Login() {
	const { executeAsync: loginRequest, isPending } = useAction(login);

	const form = useForm({
		defaultValues: nullFormState,
		onSubmit: values => {
			onSubmit(values.value);
		},
		validators: {
			onChange: loginSchema,
		},
	});

	async function onSubmit(formData: LoginType) {
		try {
			await loginRequest({ email: formData.email, password: formData.password });
		} catch {
			toast.error("Login inválido");
		}
	}

	return (
		<div className="min-h-screen flex flex-col justify-center items-center gap-y-4">
			<form
				onSubmit={e => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="w-[50%] flex flex-col gap-y-5 py-8 px-4 max-w-4xl bg-background-secondary shadow-md rounded-2xl"
			>
				<div className="flex flex-col gap-y-4">
					<div className="flex justify-center items-center gap-2">
						<Landmark className="text-custom size-9" />
						<h1 className="text-3xl font-bold text-custom">Banco do Luiz</h1>
					</div>
					<h1 className="text-2xl font-semibold text-center text-custom">
						Login Gerente
					</h1>
				</div>
				<div className="flex flex-col gap-y-3.5 bg-background-tertiary rounded-2xl px-4 py-4">
					<form.Field name="email">
						{field => (
							<div>
								<div className="flex items-center gap-2 mb-1">
									<Mail className="text-custom size-4.5" />
									<Label htmlFor="email" className="text-base text-custom">
										Email
									</Label>
								</div>
								<Input
									id="email"
									type="email"
									value={field.state.value}
									placeholder="Digite seu Email"
									onChange={e => {
										field.handleChange(e.target.value);
									}}
									className="bg-background-secondary border-none placeholder-[#747f8f]"
								/>
								<FieldInfo fieldMeta={field.state.meta} />
							</div>
						)}
					</form.Field>
					<form.Field name="password">
						{field => (
							<div>
								<div className="flex items-center gap-2 mb-1">
									<LockKeyhole className="text-custom size-4.5" />
									<Label htmlFor="password" className="text-base text-custom">
										Senha
									</Label>
								</div>
								<Input
									id="password"
									type="password"
									value={field.state.value}
									placeholder="Digite sua senha"
									onChange={e => {
										field.handleChange(e.target.value);
									}}
									className="bg-background-secondary border-none placeholder-[#747f8f]"
								/>
								<FieldInfo fieldMeta={field.state.meta} />
							</div>
						)}
					</form.Field>
					<div className="flex justify-center">
						<Button
							type="submit"
							className="w-1/2 py-5 text-base bg-background-button text-custom"
						>
							{isPending ? <Spinner /> : "Login"}
						</Button>
					</div>
				</div>
			</form>
		</div>
	);
}
