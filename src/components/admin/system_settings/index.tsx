import { RxSlash } from "react-icons/rx";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Checkbox } from "@/components/ui/checkbox";

const SystemSettings = () => {
  return (
    <div className="bg-[#F8F9FA]">
      <div className="h-full pt-10 pb-5 pl-5">
        <div className="mx-2 flex justify-start items-center w-full h-full">
          <h1 className="text-3xl font-bold pr-2">My Business</h1>
        </div>
        <div className="flex px-2">
          <div className="text-gray-400">
            <Link to="/admin/dashboard">
              <i className="fa-regular fa-folder pr-1 text-gray-300"></i>
              Dashboard
            </Link>
          </div>
          <div className="flex justify-center items-center text-gray-400">
            <RxSlash className="h-4 w-4" />
            <Link to="/admin/dashboard">
              <i className="fa-regular fa-folder pr-1 text-gray-300"></i>System
              Setting
            </Link>
          </div>
          <div className="flex justify-center items-center">
            <RxSlash className="h-4 w-4" />
            <div>
              <i className="fa-regular fa-folder pr-1"></i>My Business
            </div>
          </div>
        </div>
      </div>
      <div className="m-4 rounded-3xl px-8 py-6 flex bg-white justify-between">
        <div className="w-full">
          <div className="pt-5 pb-10 space-y-3">
            <h2 className="text-lg font-bold">Business Info</h2>
            <p className="text-textgray text-sm w-2/3">
              This company information is publicly available to your clients and
              to our millions of Virtuagym users to learn about your business.
            </p>
          </div>
          <div className="flex w-full space-x-10">
            <div className="flex-1 flex flex-col text-gray-500 space-x-1 space-y-3">
              <div>
                <Label>Company Name</Label>
                <Input type="text" placeholder="Atmosphere" />
              </div>
              <div>
                <Label>Business Type</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder="Select Type"
                      className="text-gray-300 font-semibold"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="atmosphere">Atmosphere</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Description</Label>
                <Textarea placeholder="Enter Description" />
              </div>
              <div>
                <Label>Street Road</Label>
                <Input type="text" placeholder="Old Queens Road" />
              </div>
              <div>
                <Label>Zip Code</Label>
                <Input type="text" placeholder="123456" />
              </div>
              <div>
                <Label>Secondary Language</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder="Select Language"
                      className="text-gray-300 font-semibold"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Club External ID</Label>
                <Input type="text" placeholder="#2335" />
              </div>
              <div>
                <Label>Advanced Passwords</Label>
                <Select>
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder="Select Language"
                      className="text-gray-300 font-semibold"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">On/Off</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="pt-5">
                <Button className="w-full text-black">Save</Button>
              </div>
            </div>
            <div className="flex-auto space-y-1">
              <div className="flex text-gray-500 space-x-10">
                <div className="flex-1 space-y-3">
                  <div>
                    <Label>City</Label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder="Select City"
                          className="text-gray-300 font-semibold"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pakistan">Pakistan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Phone No.</Label>
                    <Input type="text" placeholder="XXXX-XXXXXXX" />
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <Label>Country</Label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder="Select Country"
                          className="text-gray-300 font-semibold"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pakistan">Pakistan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input type="text" placeholder="info@example.com" />
                  </div>
                </div>
              </div>
              <div className="py-2">
                <MapContainer
                  center={[51.505, -0.09]}
                  zoom={13}
                  scrollWheelZoom={false}
                  className="h-32"
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[51.505, -0.09]}>
                    <Popup>
                      A pretty CSS3 popup. <br /> Easily customizable.
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
              <div className="flex text-gray-500 space-x-10">
                <div className="flex-1 space-y-3">
                  <div>
                    <Label>Facebook Page</Label>
                    <Input
                      type="text"
                      placeholder="https://www.facebook.com/example"
                    />
                  </div>
                  <div>
                    <Label>Timezone</Label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder="Select Timezone"
                          className="text-gray-300 font-semibold"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="karachi">Asia/Karachi</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Company Registr No.</Label>
                    <Input type="text" placeholder="Enter Company Registr.No" />
                  </div>
                  <div>
                    <Label>Club Key</Label>
                    <Input
                      type="text"
                      placeholder="CS-26147-ACCESS-vrwzgdRxUaP.."
                    />
                  </div>
                  <div>
                    <Checkbox className="!text-black" id="terms" />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Hide for non members
                    </label>
                  </div>
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <Label>Website</Label>
                    <Input type="text" placeholder="www.example.com" />
                  </div>
                  <div>
                    <Label>Primary Language</Label>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder="Select Language"
                          className="text-gray-300 font-semibold"
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>VAT number (EU only)</Label>
                    <Input type="text" placeholder="VAT No." />
                  </div>
                  <div>
                    <Label>API Key</Label>
                    <Input type="text" placeholder="VAT No." />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="m-4 rounded-3xl px-8 py-6 flex bg-white justify-between">
        <div className="w-full">
          <div className="pt-5 pb-10 space-y-3">
            <h2 className="text-lg font-bold">
              Contracts agreements and conditions
            </h2>
            <p className="text-textgray text-sm w-2/3">
              Manage and personalize the legal text shown on your contracts.
              Variables you can use: PAYMENT_METHOD
            </p>
          </div>
          <div className="flex">
            <div className="flex-1">
              <Label>Terms and Conditions</Label>
              <Textarea placeholder="Enter Description" />
            </div>
            <div className="flex flex-1 items-end justify-end space-x-3">
              <span className="flex-auto text-textprimary text-right">
                + Add a new field
              </span>
              <Button className="w-[15rem] text-black">
                Save & update agreements
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SystemSettings;
