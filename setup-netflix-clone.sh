#!/bin/bash

# Updated script to create the missing file structure for the Netflix clone app
# while preserving existing files and directories, working with the current structure

# Base directory - adjust this if needed
BASE_DIR="."

# Function to create directory if it doesn't exist
create_dir() {
  if [ ! -d "$1" ]; then
    echo "Creating directory: $1"
    mkdir -p "$1"
  else
    echo "Directory already exists: $1"
  fi
}

# Function to create file with content if it doesn't exist
create_file() {
  if [ ! -f "$1" ]; then
    echo "Creating file: $1"
    mkdir -p "$(dirname "$1")"
    echo "// TODO: Implement $1" > "$1"
  else
    echo "File already exists: $1"
  fi
}

# Function to create an empty component file with basic React structure
create_component_file() {
  if [ ! -f "$1" ]; then
    echo "Creating component file: $1"
    mkdir -p "$(dirname "$1")"
    echo "import React from 'react';

export default function $(basename "$1" .tsx)() {
  return (
    <div>
      <h1>$(basename "$1" .tsx) Component</h1>
    </div>
  );
}" > "$1"
  else
    echo "Component file already exists: $1"
  fi
}

# Function to create a basic page component
create_page_file() {
  if [ ! -f "$1" ]; then
    echo "Creating page file: $1"
    mkdir -p "$(dirname "$1")"
    echo "export default function Page() {
  return (
    <div>
      <h1>$(basename $(dirname "$1")) Page</h1>
    </div>
  );
}" > "$1"
  else
    echo "Page file already exists: $1"
  fi
}

# Function to create a hook file
create_hook_file() {
  if [ ! -f "$1" ]; then
    echo "Creating hook file: $1"
    mkdir -p "$(dirname "$1")"
    echo "import { useState, useEffect } from 'react';

export default function $(basename "$1" .ts)() {
  // TODO: Implement $(basename "$1" .ts) hook
  
  return {
    // Return values here
  };
}" > "$1"
  else
    echo "Hook file already exists: $1"
  fi
}

# Create the directory structure

# Auth section
create_dir "$BASE_DIR/app/(auth)/login"
create_page_file "$BASE_DIR/app/(auth)/login/page.tsx"

# Authenticated section (check if directories exist before creating)
create_dir "$BASE_DIR/app/(authenticated)"
create_file "$BASE_DIR/app/(authenticated)/layout.tsx"
create_page_file "$BASE_DIR/app/(authenticated)/page.tsx"

# Make sure favorites and watch-later directories exist
create_dir "$BASE_DIR/app/(authenticated)/favorites"
create_dir "$BASE_DIR/app/(authenticated)/watch-later"

# Create page files if they don't exist
create_page_file "$BASE_DIR/app/(authenticated)/favorites/page.tsx"
create_page_file "$BASE_DIR/app/(authenticated)/watch-later/page.tsx"

# Components directory
create_dir "$BASE_DIR/components/auth"
create_component_file "$BASE_DIR/components/auth/LoginButton.tsx"
create_component_file "$BASE_DIR/components/auth/LogoutButton.tsx"

create_dir "$BASE_DIR/components/layout"
create_component_file "$BASE_DIR/components/layout/Header.tsx"
create_component_file "$BASE_DIR/components/layout/Sidebar.tsx"
create_component_file "$BASE_DIR/components/layout/ActivityFeed.tsx"

create_dir "$BASE_DIR/components/movies"
create_component_file "$BASE_DIR/components/movies/MovieCard.tsx"
create_component_file "$BASE_DIR/components/movies/MovieGrid.tsx"
create_component_file "$BASE_DIR/components/movies/Pagination.tsx"

create_dir "$BASE_DIR/components/filters"
create_component_file "$BASE_DIR/components/filters/SearchFilter.tsx"
create_component_file "$BASE_DIR/components/filters/YearFilter.tsx"
create_component_file "$BASE_DIR/components/filters/GenreFilter.tsx"

# Hooks directory
create_dir "$BASE_DIR/hooks"
create_hook_file "$BASE_DIR/hooks/useMovies.ts"
create_hook_file "$BASE_DIR/hooks/useFavorites.ts"
create_hook_file "$BASE_DIR/hooks/useWatchLater.ts"
create_hook_file "$BASE_DIR/hooks/useActivities.ts"

# Providers directory
create_dir "$BASE_DIR/providers"
create_file "$BASE_DIR/providers/AuthProvider.tsx"

# Utils directory
create_dir "$BASE_DIR/utils"
create_file "$BASE_DIR/utils/auth.ts"
create_file "$BASE_DIR/utils/api.ts"

echo "File structure creation completed!"