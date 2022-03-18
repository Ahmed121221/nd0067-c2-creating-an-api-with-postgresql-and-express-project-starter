import { Category } from "../category";

describe("Category module:", () => {
	it("shuld create Category", async () => {
		const c = await new Category(2, "testCategory").create();
		expect(c).toEqual({ id: 2, name: "testCategory" });
	});

	it("shuld get Category by id", async () => {
		const c = await new Category(2).checId();
		expect(c).toBeTrue();
	});
});
