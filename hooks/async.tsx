import { useState, useCallback, useEffect } from "react"


const useAsync = (asyncF: () => Promise<any>) => {
	const [res, setRes] = useState(null);
	const [err, setErr] = useState(null);
	const [stat, setStat] = useState("running");

	const execute = useCallback(() => {
		asyncF().then(r => {
			setRes(r);
			setStat("done");
		}).catch(e => {
			setErr(e);
			setStat("error");
		})
	}, [asyncF])

	useEffect(() => {
		execute();
	}, [])

	return { execute, res, err, stat };
}

export default useAsync;