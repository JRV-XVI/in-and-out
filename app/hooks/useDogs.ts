import { useEffect, useState } from "react";
import { getDogs } from "../services/dogs";
import { Dog } from "../types/dog";

export function useDogs() {
	const [dogs, setDogs] = useState<Dog[]>([]);
	const [loading, setLoading] = useState(true);
	useEffect(() => {
		getDogs().then(data => {
			setDogs(data);
			setLoading(false);
		}).catch(() => setLoading(false));
	}, [])
	return { dogs, loading };
}
