"use client";
import { useForm } from "@tanstack/react-form";
import { loginSchema, type LoginType, nullFormState } from "./_components/formSchema";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FieldInfo } from "@/components/forms/FieldInfo";
import { Button } from "@/components/ui/button";
import { login } from "@/api/auth";
import { toast } from "sonner";

export default function Login() {
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
			await login(formData.email, formData.password);
		} catch {
			toast.error("Login inválido");
		}
	}

	return (
		<div className="min-h-screen flex flex-col justify-center items-center">
			<div>
				<h1 className="text-4xl">Login de usuário</h1>
			</div>
			<form
				onSubmit={e => {
					e.preventDefault();
					e.stopPropagation();
					form.handleSubmit();
				}}
				className="w-[80%] flex flex-col gap-y-5 py-8 px-4 max-w-4xl bg-white shadow-md rounded-2xl"
			>
				<form.Field name="email">
					{field => (
						<div>
							<Label htmlFor="email" className="text-xl">
								Email
							</Label>
							<Input
								id="email"
								type="email"
								value={field.state.value}
								placeholder="Email"
								onChange={e => {
									field.handleChange(e.target.value);
								}}
							/>
							<FieldInfo fieldMeta={field.state.meta} />
						</div>
					)}
				</form.Field>
				<form.Field name="password">
					{field => (
						<div>
							<Label htmlFor="password" className="text-xl">
								Senha
							</Label>
							<Input
								id="password"
								type="password"
								value={field.state.value}
								placeholder="Senha"
								onChange={e => {
									field.handleChange(e.target.value);
								}}
							/>
							<FieldInfo fieldMeta={field.state.meta} />
						</div>
					)}
				</form.Field>
				<div className="flex justify-center">
					<Button type="submit">Login</Button>
				</div>
			</form>
		</div>
	);
}
