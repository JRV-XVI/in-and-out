import { getAllUsers, getUser, createUser, updateUser, deleteUser } from "../services/users";
import { User } from "../types/user";

// mock del módulo supabase
jest.mock("../lib/supabase", () => ({
	__esModule: true,
	default: {
		from: jest.fn(() => ({
			select: jest.fn().mockReturnThis(),
			eq: jest.fn().mockReturnThis(),
			single: jest.fn().mockReturnThis(),
			insert: jest.fn().mockReturnThis(),
			update: jest.fn().mockReturnThis(),
			delete: jest.fn().mockReturnThis(),
		})),
	},
}));

import supabase from "../lib/supabase";

const mockUser: User = {
	id: 1,
	name: "John Doe",
	email: "john@example.com",
	password: "123456",
	phone: 1234567890,
	userType: 1,
};

describe("User service", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("getAllUsers devuelve lista de usuarios", async () => {
		(supabase.from as jest.Mock).mockReturnValueOnce({
			select: jest.fn().mockResolvedValue({ data: [mockUser], error: null }),
		});

		const result = await getAllUsers();
		expect(result).toEqual([mockUser]);
	});

	it("getUser devuelve un usuario válido", async () => {
		(supabase.from as jest.Mock).mockReturnValueOnce({
			select: jest.fn().mockReturnThis(),
			eq: jest.fn().mockReturnThis(),
			single: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
		});

		const result = await getUser("john@example.com", "123456");
		expect(result).toEqual(mockUser);
	});

	it("createUser crea un usuario", async () => {
		(supabase.from as jest.Mock).mockReturnValueOnce({
			insert: jest.fn().mockReturnThis(),
			select: jest.fn().mockReturnThis(),
			single: jest.fn().mockResolvedValue({ data: mockUser, error: null }),
		});

		const result = await createUser({
			name: "John Doe",
			email: "john@example.com",
			password: "123456",
			phone: 1234567890,
			userType: 1,
		});
		expect(result).toEqual(mockUser);
	});

	it("updateUser actualiza un usuario", async () => {
		const updatedUser = { ...mockUser, name: "Jane Doe" };

		(supabase.from as jest.Mock).mockReturnValueOnce({
			update: jest.fn().mockReturnThis(),
			eq: jest.fn().mockReturnThis(),
			select: jest.fn().mockReturnThis(),
			single: jest.fn().mockResolvedValue({ data: updatedUser, error: null }),
		});

		const result = await updateUser(1, { name: "Jane Doe" });
		expect(result).toEqual(updatedUser);
	});

	it("deleteUser elimina un usuario", async () => {
		(supabase.from as jest.Mock).mockReturnValueOnce({
			delete: jest.fn().mockReturnThis(),
			eq: jest.fn().mockResolvedValue({ error: null }),
		});

		const result = await deleteUser(1);
		expect(result).toBe(true);
	});
});

