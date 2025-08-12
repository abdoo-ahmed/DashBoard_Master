
const SUPABASE_URL = "https://ovgkmcvaonwcixphjffb.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92Z2ttY3Zhb253Y2l4cGhqZmZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NjA1ODMsImV4cCI6MjA3MDMzNjU4M30.7MwQAodWSiWPW5FS0WhUCwkiotoOjKIdIy3-pm7Rjvg";

export async function addUser(name, email, age, phone, access) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/User`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({ name, email, age, phone, access }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to add user: ${errorText}`);
    }

    const data = await res.json();

    if (!data || data.length === 0) {
      throw new Error("No data returned from server");
    }

    return data;
  } catch (err) {
    console.error("Error adding user:", err.message);
    throw err;
  }
}

export async function getUsers() {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/User`, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: "return=representation",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch users: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    if (!data || data.length === 0) {
      console.warn("No users found");
      return [];
    }

    return data;
  } catch (error) {
    console.error("Error fetching users:", error.message);
    return [];
  }
}

export async function updateUser(id, { name, email, age, phone, access } = {}) {
  if (!id) throw new Error("User ID is required");

  const updatedFields = {};
  if (name !== undefined) updatedFields.name = name;
  if (email !== undefined) updatedFields.email = email;
  if (age !== undefined) updatedFields.age = age;
  if (phone !== undefined) updatedFields.phone = phone;
  if (access !== undefined) updatedFields.access = access;

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/User?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(updatedFields),
    });

    if (!res.ok) {
      throw new Error(`Failed to update user: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    if (!data || data.length === 0) {
      throw new Error("No user found or no fields were updated");
    }

    return data;
  } catch (error) {
    console.error("Error updating user:", error.message);
    throw error;
  }
}

export async function deleteUser(id) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/User?id=eq.${id}`, {
      method: "DELETE",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: "return=representation",
      },
    });

    if (!res.ok) {
      throw new Error(`Failed to delete user: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    if (data.length === 0) {
      throw new Error(`User with id ${id} not found`);
    }

    return data;
  } catch (error) {
    console.error("Error deleting user:", error.message);
    return { error: error.message };
  }
}

export async function searchUserByName(name) {
  if (!name) {
    return { error: true, message: "name is required" };
  }

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/User?name=ilike.${encodeURIComponent(name + "%")}`,
      {
        method: "GET",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          Prefer: "return=representation",
        },
      }
    );

    if (!res.ok) {
      return { error: true, message: `Request failed with status ${res.status}` };
    }

    const data = await res.json();

    if (!data || data.length === 0) {
      return { error: true, message: "User not found" };
    }

    return { error: false, data };
  } catch (err) {
    return { error: true, message: err.message };
  }
}

export async function searchUserByAge(age) {
  if (!age || isNaN(age)) {
    return { error: true, message: "Valid age is required" };
  }

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/User?age=eq.${age}`, {
      method: "GET",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Prefer: "return=representation",
      },
    });

    if (!res.ok) {
      return { error: true, message: `Request failed with status ${res.status}` };
    }

    const data = await res.json();

    if (!data || data.length === 0) {
      return { error: true, message: "No users found with this age" };
    }

    return { error: false, data };
  } catch (err) {
    return { error: true, message: err.message };
  }
}

export async function getUserByEmail(email) {
  if (!email) throw new Error("Email is required");

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/User?email=eq.${encodeURIComponent(email)}&limit=1`,
      {
        method: "GET",
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }

    const data = await res.json();

    if (!data || data.length === 0) {
      return { error: true, message: "User not found" };
    }

    return { error: false, data: data[0] };
  } catch (err) {
    return { error: true, message: err.message };
  }
}

export async function getUserById(userId) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/User?id=eq.${userId}`, {
      method: "GET",
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch user: ${errorText}`);
    }

    const data = await res.json();

    if (!data || data.length === 0) {
      throw new Error("User not found");
    }

    return data[0];
  } catch (err) {
    console.error("Error fetching user by ID:", err.message);
    throw err;
  }
}

    