import { useEffect, useState } from "react"
import api from "../api/axios"

function Home() {
    const [posts, setPosts] = useState([])

    useEffect(() => {

        const fetchPosts = async () => {
            try {
                const res = await api.get("/posts")
                setPosts(res.data.data.posts)
            } catch (err) {
                console.error(err)
            }
        }

        fetchPosts()

    }, [])

    return (
        <div className="p-10">
            <h1 className="text-2xl font-bold mb-6">Blog Posts</h1>

            {posts.map((post) => (
                <div
                    key={post.id}
                    className="border p-4 mb-4 rounded shadow"
                >
                    <h2 className="text-xl font-semibold">
                        {post.title}
                    </h2>

                    <p className="text-gray-600 mt-2">
                        {post.content}
                    </p>
                </div>
            ))}
        </div>
    )
}

export default Home
