package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strings"

	"github.com/gorilla/mux"
	"github.com/gorilla/handlers"
)

type Podcast struct {
	ID       string `json:"id"`
	Title    string `json:"title"`
	Category string `json:"category"`
	Author   string `json:"author"`
}

var podcasts []Podcast

func init() {
	podcasts = []Podcast{
		{ID: "1", Title: "Tech Innovations", Category: "Technology", Author: "Isaac"},
		{ID: "2", Title: "Space Exploration", Category: "Science", Author: "Teknoir HR"},
		{ID: "3", Title: "Mindful Living", Category: "Health", Author: "Wellness Guru"},
		{ID: "4", Title: "World History Uncovered", Category: "History", Author: "History Buff"},
		{ID: "5", Title: "Future of AI", Category: "Technology", Author: "Tech Enthusiast"},
		{ID: "6", Title: "Nature's Wonders", Category: "Science", Author: "Naturalist"},
		{ID: "7", Title: "Healthy Cooking Tips", Category: "Health", Author: "Nutrition Expert"},
		{ID: "8", Title: "Ancient Mysteries", Category: "History", Author: "Explorer"},
		{ID: "9", Title: "Coding Adventures", Category: "Technology", Author: "Code Wizard"},
		{ID: "10", Title: "Discovering Microorganisms", Category: "Science", Author: "Microbiologist"},
		{ID: "11", Title: "Future of Robotics", Category: "Technology", Author: "Tech Enthusiast"},
		{ID: "12", Title: "Ocean Exploration", Category: "Science", Author: "Marine Scientist"},
		{ID: "13", Title: "Mind-Body Connection", Category: "Health", Author: "Wellness Guru"},
		{ID: "14", Title: "Historical Mysteries", Category: "History", Author: "History Enthusiast"},
		{ID: "15", Title: "AI in Healthcare", Category: "Technology", Author: "Health Tech Innovator"},
		{ID: "16", Title: "Botany Adventures", Category: "Science", Author: "Botanist"},
		{ID: "17", Title: "Holistic Wellness", Category: "Health", Author: "Holistic Practitioner"},
		{ID: "18", Title: "Medieval History Tales", Category: "History", Author: "History Buff"},
		{ID: "19", Title: "Web Development Insights", Category: "Technology", Author: "Web Developer"},
		{ID: "20", Title: "Space Discoveries", Category: "Science", Author: "Astrophysicist"},
	}
}

func main() {
	r := mux.NewRouter()

	r.HandleFunc("/podcasts", getAllPodcasts).Methods("GET")
	r.HandleFunc("/podcasts/search/{query}", getPodcastsSearch).Methods("GET")
	r.HandleFunc("/podcasts/category/{category}", getPodcastsCategory).Methods("GET")
	r.HandleFunc("/podcasts/title/{title}", getPodcastsTitle).Methods("GET")

	corsHandler := handlers.CORS(
		handlers.AllowedOrigins([]string{"http://localhost:3000"}),
		handlers.AllowedMethods([]string{"GET", "POST", "PUT", "DELETE"}),
		handlers.AllowedHeaders([]string{"Content-Type"}),
	)(r)

	port := ":8080"
	log.Printf("Server is running on http://localhost%s", port)
	log.Fatal(http.ListenAndServe(port, corsHandler))
}

func getAllPodcasts(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(podcasts)
}

func getPodcastsSearch(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	query := params["query"]
	var result []Podcast

	for _, podcast := range podcasts {
		if strings.Contains(strings.ToLower(podcast.Title), strings.ToLower(query)) ||
			strings.Contains(strings.ToLower(podcast.Category), strings.ToLower(query)) ||
			strings.Contains(strings.ToLower(podcast.Author), strings.ToLower(query)) {
			result = append(result, podcast)
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func getPodcastsCategory(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	category := params["category"]
	var result []Podcast

	for _, podcast := range podcasts {
		if strings.EqualFold(podcast.Category, category) {
			result = append(result, podcast)
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}

func getPodcastsTitle(w http.ResponseWriter, r *http.Request) {
	params := mux.Vars(r)
	title := params["title"]
	var result []Podcast

	for _, podcast := range podcasts {
		if strings.Contains(strings.ToLower(podcast.Title), strings.ToLower(title)) {
			result = append(result, podcast)
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
}