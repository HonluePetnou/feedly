from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_main():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Bienvenue sur la Plateforme de Surveillance et d'Aide à la Décision"}

def test_create_app():
    # Note: This might fail if the DB is not reset or if we run it multiple times without cleanup.
    # For a simple test, we'll use a random package name or handle the 400.
    import random
    suffix = random.randint(1000, 9999)
    package_name = f"com.example.app{suffix}"
    
    response = client.post(
        "/api/v1/apps/",
        json={"package_name": package_name, "name": "Test App"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["package_name"] == package_name
    assert "id" in data

def test_read_apps():
    response = client.get("/api/v1/apps/")
    assert response.status_code == 200
    assert isinstance(response.json(), list)
