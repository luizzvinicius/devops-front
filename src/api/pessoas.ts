import axios from "axios";
import { BASE_URL } from "@/constants/constants";
import type { PessoaPageDto, PessoaRequestDto, PessoaResponseDto } from "@/models/pessoa-model";

const ENTITY = "/pessoa";

export const getAllPessoas = async (page: number) => {
	const { data } = await axios.get<PessoaPageDto>(`${BASE_URL}${ENTITY}/all`, {
		params: { p: page },
	});

	return data;
};

export const createPessoa = async (params: PessoaRequestDto) => {
	const { data } = await axios.post<PessoaResponseDto>(`${BASE_URL}${ENTITY}`, params);
	return data;
};

export const updatePessoa = async (id: number, params: PessoaRequestDto) => {
	const { data } = await axios.put<PessoaResponseDto>(`${BASE_URL}${ENTITY}/${id}`, params);
	return data;
};

export const deletePessoa = async (id: number) => {
	const { status } = await axios.delete(`${BASE_URL}${ENTITY}/${id}`);
	return status;
};
