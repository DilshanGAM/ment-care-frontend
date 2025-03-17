import { createClient } from "@supabase/supabase-js";

const anon_key =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im95dXNxZmd4Z21lYm11cXRvYW91Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMDE1OTksImV4cCI6MjA1Nzc3NzU5OX0.BVWpEPybI9gOYAp6GohWHpQN4t4g53B_WD4_27i9jr0";
const supabase_url = "https://oyusqfgxgmebmuqtoaou.supabase.co";

const supabase = createClient(supabase_url, anon_key);

export default function mediaUpload(file:any) {
	return new Promise((resolve, reject) => {
        if(file == null){
            reject("No file selected")
        }

		const timestamp = new Date().getTime();
		const fileName = timestamp + file.name;

		supabase.storage
			.from("images")
			.upload(fileName, file, {
				cacheControl: "3600",
				upsert: false,
			})
			.then(() => {
				const publicUrl = supabase.storage.from("images").getPublicUrl(fileName)
					.data.publicUrl;
				resolve(publicUrl);
			}).catch(()=>{
                reject("Error uploading file")
            })
	});
}
