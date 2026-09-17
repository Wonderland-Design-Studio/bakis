$images = @(
    @{ name = "logo-dark.png"; url = "https://www.bakis.co.za/wp-content/uploads/2023/07/2-removebg-preview.png" },
    @{ name = "logo-white.png"; url = "https://www.bakis.co.za/wp-content/uploads/2023/02/LogoW.png" },
    @{ name = "product-circuit-breakers.jpg"; url = "https://www.bakis.co.za/wp-content/uploads/2023/07/4.jpg" },
    @{ name = "product-distribution-boards.jpg"; url = "https://www.bakis.co.za/wp-content/uploads/2023/07/distribution-board-300x300.jpg" },
    @{ name = "product-switchgear.jpg"; url = "https://www.bakis.co.za/wp-content/uploads/2023/07/switchgear-300x259.jpg" },
    @{ name = "product-surge-arrestors.png"; url = "https://www.bakis.co.za/wp-content/uploads/2023/07/custom_resized_ad7706ba-1a64-4a46-876c-651cdff6ff61.png" },
    @{ name = "product-solar-solutions.jpg"; url = "https://www.bakis.co.za/wp-content/uploads/2024/06/3-Solar-Solutions-1-1-1024x683.jpg" },
    @{ name = "product-cables.png"; url = "https://www.bakis.co.za/wp-content/uploads/2024/06/1-CABLES-1.png" },
    @{ name = "product-substation.jpg"; url = "https://www.bakis.co.za/wp-content/uploads/2024/06/4-Substation-Equipment-1-1024x683.jpg" },
    @{ name = "product-streetlighting.jpg"; url = "https://www.bakis.co.za/wp-content/uploads/2024/06/2-Streelighting-1-1024x683.jpg" },
    @{ name = "client-ethekwini.png"; url = "https://www.bakis.co.za/wp-content/uploads/2023/05/thekwini-removebg-preview.png" },
    @{ name = "client-tshwane.png"; url = "https://www.bakis.co.za/wp-content/uploads/2023/05/city-of-tshwane.png" },
    @{ name = "client-capetown.png"; url = "https://www.bakis.co.za/wp-content/uploads/2023/05/coct-logo@2x.png" },
    @{ name = "client-armscor.png"; url = "https://www.bakis.co.za/wp-content/uploads/2023/05/Armscor-logo-removebg-preview.png" },
    @{ name = "client-eskom.png"; url = "https://www.bakis.co.za/wp-content/uploads/2023/05/eskom_blue-removebg-preview.png" },
    @{ name = "client-citypower.jpg"; url = "https://www.bakis.co.za/wp-content/uploads/2023/06/CityPower_Logo.jpg" }
)

New-Item -ItemType Directory -Force -Path "assets\images" | Out-Null

foreach ($img in $images) {
    $outPath = Join-Path "assets\images" $img.name
    Write-Host "Downloading $($img.name)..."
    curl.exe -k -s -L $img.url -o $outPath
}
Write-Host "All assets downloaded successfully."
