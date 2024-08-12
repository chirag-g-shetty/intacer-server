import Groq from "groq-sdk";
const groq = new Groq({ apiKey:'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' });
const inCache = (key:string)=>{
    // logic
    return false
}
const model = async (p1:string,p2:string,prompt:string) =>{
    const res = await groq.chat.completions.create({
        messages: [
            {
                role: 'user',
                content: `I am trying to understand ${p2} using ${p1} using analogies`+'\n'+prompt+'\n',
            },
        ],
        model: "llama3-8b-8192",
        temperature: 0.3,
    })
    return res.choices[0]?.message?.content || "Some Error"
}
const edu = async (p1:string,p2:string,f:number,pdf?:string) =>{
    let temp = ''
    switch(f){
        case 0: // images + desc
            const desc = await model(p1,p2,'How would you explain it to me (less than 4 sentences)');
            /*if(inCache(p1+p2)){
                // return as usual
            }else{
                try{
                const postUrl = "https://cloud.leonardo.ai/api/rest/v1/generations";
                const payload = {
                    alchemy: false,
                    height: 768,
                    modelId: "b24e16ff-06e3-43eb-8d33-4416c2d75876",
                    num_images: 3,
                    prompt: await model(p1,p2,`want to visualize ${p2} using ${p1}, so can you generate an concise optimized prompt for a text to image model?`),
                    width: 1024,
                    expandedDomain: true,
                    num_inference_steps: 30,
                    promptMagic: true,
                    sd_version: "SDXL_1_0 ",
                };
                const headers = {
                    accept: "application/json",
                    "content-type": "application/json",
                    authorization: "Bearer 267b0fea-d10b-4ba4-9218-43f8a1dad8e1",
                };
                const res = await fetch(postUrl, {
                        method: "POST",
                        headers: headers,
                        body: JSON.stringify(payload),
                    });
                    const postResult = await res.json();
                    // @ts-ignore
                    const generationId = postResult.sdGenerationJob['generationId'];
                    await new Promise((resolve)=>setTimeout(resolve,25000))
                    const getUrl = `https://cloud.leonardo.ai/api/rest/v1/generations/${generationId}`;
                    const getResponse = await fetch(getUrl, { headers: headers });

                    const getResult = await getResponse.json();
                    // @ts-ignore
                    const urls = getResult.generations_by_pk.generated_images.map(
                        (img: { url: any; }) => img.url
                    );
                    return [urls, desc];
                }catch(e){
                    console.log(e)
                }
            }*/
            return [[await model(p1,p2,`want to visualize ${p2} using ${p1}, so can you generate an concise optimized prompt for a text to image model?`)],desc]
            break;
        case 1:// big pic
            return await model(p1,p2,`Give me the big picture of how will the knowledge of both ${p1} and ${p2} will help me in the real world (less than 4 sentences)`)
        case 2:// popular apps
            return await model(p1,p2,'Can you name some popular applications relevant to mix of the 2 disciplines? (top 4 points with less than 3 words')
        case 3:// HOTS
            return await model(p1,p2,'Can you come up with some HOTS (Higher Order Thinking Skills) questions? (Maximum 3, each question be a 1 liner)')
        case 4:// Summary
            const url = "https://jp-tok.ml.cloud.ibm.com/ml/v1/text/generation?version=2023-05-29";
            const headers = {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer eyJraWQiOiIyMDI0MDcwNDA4NDAiLCJhbGciOiJSUzI1NiJ9.eyJpYW1faWQiOiJJQk1pZC02OTYwMDBHMFVPIiwiaWQiOiJJQk1pZC02OTYwMDBHMFVPIiwicmVhbG1pZCI6IklCTWlkIiwianRpIjoiMzljZmZjNDgtOTkwNy00YzI5LWE5ODktOGU0YmZjY2NjNzI3IiwiaWRlbnRpZmllciI6IjY5NjAwMEcwVU8iLCJnaXZlbl9uYW1lIjoiQWJoaXNoZWsiLCJmYW1pbHlfbmFtZSI6IlBhdWwgUCIsIm5hbWUiOiJBYmhpc2hlayBQYXVsIFAiLCJlbWFpbCI6IjIyZGlwY3NlMDAxQGJubWl0LmluIiwic3ViIjoiMjJkaXBjc2UwMDFAYm5taXQuaW4iLCJhdXRobiI6eyJzdWIiOiIyMmRpcGNzZTAwMUBibm1pdC5pbiIsImlhbV9pZCI6IklCTWlkLTY5NjAwMEcwVU8iLCJuYW1lIjoiQWJoaXNoZWsgUGF1bCBQIiwiZ2l2ZW5fbmFtZSI6IkFiaGlzaGVrIiwiZmFtaWx5X25hbWUiOiJQYXVsIFAiLCJlbWFpbCI6IjIyZGlwY3NlMDAxQGJubWl0LmluIn0sImFjY291bnQiOnsidmFsaWQiOnRydWUsImJzcyI6ImI3MGZjMmM2OGRlMjRmM2U4OGM2MjkzMDM3NDBiNzI1IiwiZnJvemVuIjp0cnVlfSwiaWF0IjoxNzIwODUyMDc1LCJleHAiOjE3MjA4NTU2NzUsImlzcyI6Imh0dHBzOi8vaWFtLmNsb3VkLmlibS5jb20vaWRlbnRpdHkiLCJncmFudF90eXBlIjoidXJuOmlibTpwYXJhbXM6b2F1dGg6Z3JhbnQtdHlwZTphcGlrZXkiLCJzY29wZSI6ImlibSBvcGVuaWQiLCJjbGllbnRfaWQiOiJkZWZhdWx0IiwiYWNyIjoxLCJhbXIiOlsicHdkIl19.RYQnxEwjof7FlyYbVCvc0tgoT9Un4WGrcVwerwn0c25X6XQRsGjehMazVZaeG40Tl4h2YgBA4dB6osEc0GRPZEpBuwvPn-js2dX9UyCKYGsUoy9ItGhehLExUJRVSOVczKbusQMWHDmMhBt3H54zSyWq0_nhYZcbIufskD7BDwHt6YWvl_DbCDtGZ30qLiqvO_HCFbrAWw3DBaUfRAf2Bbka2DDAULCsVRNx0hqYpOuWWHFW0OhtulrKP7zYMQmK_qd1Pn1D_qydkQ7-0SdXSEupp5F-3HLCkAdDCIbrw6q4y5brvievtE0PFMA1KYqSysFtXd70VuIPpxYSTiZ9tA"
            };
            const body = {
                input: `${pdf}`,
                parameters: {
                    decoding_method: "greedy",
                    max_new_tokens: 900,
                    min_new_tokens: 0,
                    stop_sequences: [],
                    repetition_penalty: 1.05
                },
                model_id: "ibm/granite-13b-chat-v2",
                project_id: "cb4be51e-3f75-48e5-baed-08c2d4cef0c3"
            };

            try {
                const response = await fetch(url, {
                    headers,
                    method: "POST",
                    body: JSON.stringify(body)
                });
                const data = await response.json();
                return data
            } catch (error) {
                console.log(error)
            }
        return 'Hope Not'
    }
}

export default edu